# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Angular 21 (standalone components, SSR via Angular Universal + Express) app for **Ambulancias 247**. It's a single-page multi-step form ("Registro de Traslado") that ambulance staff fill out during a patient transfer: looks up transfer data from an external legacy system, captures patient/clinical data, captures up to 5 handwritten/uploaded signatures, and submits everything so a PDF can be generated.

## Commands

```bash
npm start                # ng serve — dev server at http://localhost:4200, proxies /index.php per proxy.conf.json
npm run build            # ng build (production by default)
npm run watch            # ng build --watch --configuration development
npm test                 # ng test — runs Vitest via @angular/build:unit-test
npm run serve:ssr:form-ambulancias-247   # run the built SSR server (node dist/form-ambulancias-247/server/server.mjs)
```

To run a single test file, pass the file to the underlying Vitest runner, e.g.:
```bash
npx vitest run src/app/modules/traslado/steps/firmas-step/firmas-step.spec.ts
```

There is no e2e setup and no lint script configured in `package.json`.

## Architecture

### Two separate backends, neither lives in this repo

- **`ServicioService`** (`src/app/services/servicio.service.ts`) talks to a legacy PHP endpoint (`environment.servicioApiUrl`, proxied through `/index.php` in dev via `proxy.conf.json` → `https://ambulancia.urlcs.co`). It POSTs a `{usuario, password, datos}` envelope with query params `page=Servicio&api=<ApiName>`:
  - `Servicio.consumo` — look up an existing transfer by `autorizacion` (authorization number), used to pre-fill the form.
  - `Traslado.guardar` — persist the completed transfer.
- **`PdfService`** (`src/app/services/generar-pdf.ts`) targets a different API (`environment.apiUrl`, `GeneratePdf/generatePdf`) which is expected to render the submitted data into a PDF and return `{fileName, fileBase64}`. **This service exists but is not yet called anywhere** — `Registro.finalizar()` currently only calls `guardarTraslado()` and `console.log`s the DTO. Wiring the PDF generation call into the submit flow is a known gap.
- Credentials for the legacy PHP API are currently hardcoded in `src/environments/environment*.ts`. `environment.prod.ts`'s `apiUrl` is a placeholder (`https://api.tudominio.com/api`) that needs to be set to the real PDF backend before shipping.

### Form architecture — one root FormGroup, driven by a stepper

`Registro` (`src/app/modules/traslado/pages/registro/registro.ts`) owns a single reactive `FormGroup` with nested groups/arrays matching the domain sections, rendered as an 8-step `MatStepper`:

```
traslado (transfer info) → paciente (patient) → antecedentes (medical history)
→ signos (FormArray of vital-sign readings) → examen (physical exam)
→ registroGasto (FormArray of expenses) → conducta (outcome/conduct) → firmas (5 signatures)
```

Each step is a standalone component that receives its slice of the form via `@Input() group!: FormGroup` (or the FormArray directly for `signos`/`registroGasto`) — see `traslado-step.ts` for the pattern. `Registro.getStepControl(index)` maps stepper index → control for per-step validation before `stepper.next()` advances.

Validators, labels, and the list of fields whose validators get toggled all live in `src/app/constants/form-fields.constants.ts` (`FORM_FIELD_VALIDATORS`, `FIELD_LABELS`, `SIGNOS_FIELD_VALIDATORS`, `GASTO_FIELD_VALIDATORS`, `FIELDS_TO_TOGGLE_VALIDATORS`). When `traslado.trasladoFallido` (failed transfer) is toggled true, `updateValidatorsBasedOnTrasladoFallido()` clears validators on the listed fields/arrays and locks numeric vitals/expense fields to `0` instead of requiring real values — any new field that should be optional on a failed transfer needs to be added to `FIELDS_TO_TOGGLE_VALIDATORS` (and its validator map) too.

`Registro.finalizar()` re-validates everything, collects human-readable errors via `getFormErrors()` (walking the form tree recursively, mapping control paths through `FIELD_LABELS`) and shows them in `ValidationErrorDialog`, or otherwise builds the submit DTO and shows `SuccessDialog` while `guardarTraslado()` is in flight.

### Signature capture

`FirmaPad` (`src/app/modules/traslado/components/firma-pad/`) is a canvas-based signature pad using Pointer Events (mouse/touch/stylus unified), with a `ResizeObserver` to size the canvas correctly once it becomes visible inside a hidden stepper step, plus a file-upload fallback. `FirmasStep` renders 5 instances (médico, enfermería, conductor, familiar, entidad receptora) via `@ViewChildren(FirmaPad)` and reads each one's `obtenerFirmaBase64()` into the `firmas` form group by fixed array position — the order of `FirmaPad` instances in `firmas-step.html` must match the order signatures are read out in `guardarFirmas()`.

### SSR

Standard Angular SSR split: `main.ts`/`app.config.ts` for the browser, `main.server.ts`/`app.config.server.ts`/`app.routes.server.ts` for the server bundle, `server.ts` is the Express entry point that serves the browser build and falls back to Angular's request handler. `server.ts` has a commented placeholder showing where Express API routes would go — none are defined; all backend calls are made client-side over HTTP to the two external APIs above.

### Domain vocabulary (Spanish)

`traslado` = transfer, `paciente` = patient, `antecedentes` = medical history/background, `signos` (vitales) = vital signs, `examen` (físico) = physical exam, `registroGasto`/`gastos` = expenses, `conducta` = outcome/disposition, `firmas` = signatures, `autorizacion` = authorization number (the key used to look up a transfer from the legacy system).
