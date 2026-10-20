# Phishing Homográfico

**Test interactivo y analizador de dominios homográficos**, de [Un Fantasma en el Sistema](https://www.unfantasmaenelsistema.com).

▶ **Abrir:** https://unfantasmaenelsistema.github.io/Phishing-Homografico/

El phishing homográfico registra dominios que cambian letras latinas por otras de alfabetos distintos (cirílico, griego…) que se dibujan igual: `pаypal.com` con una «а» cirílica parece PayPal, pero el DNS lo registra como `xn--pypal-4ve.com`, un dominio de otra persona.

## Test

- **10 correos** elegidos al azar de un banco de 16 (bancos, paquetería, Apple, Google, WhatsApp…), con entre 5 y 7 homógrafos en cada partida.
- Hay que decidir mirando solo el dominio del enlace: el texto es igual de convincente en los correos falsos y en los auténticos.
- Tras cada respuesta se marca **letra a letra** el carácter impostor, su código Unicode, el alfabeto del que viene, la letra a la que imita y el dominio `xn--` que registra el DNS.
- La respuesta correcta no está escrita a mano: sale del mismo análisis que el analizador, así que nunca se contradicen.
- El correo se dibuja con Arial, que tiene glifos cirílicos y griegos idénticos a los latinos (comprobado píxel a píxel), como un cliente de correo real.
- Atajos: **L** legítimo · **P** phishing · **Intro** siguiente.

## Analizador

Pega un enlace, un dominio o una dirección de correo y te dice:

| Veredicto | Qué significa |
|---|---|
| Sin homógrafos Unicode | Solo ASCII (aún puede ser *typosquatting*, como `paypa1.com`) |
| Dominio internacional normal | Letras latinas con tilde o ñ (`españa.es`) |
| Otro alfabeto | No latino y sin imitar al latino (`яндекс.рф`) |
| **Mezcla de alfabetos** | Latino + cirílico/griego en la misma etiqueta: phishing homográfico |
| **Alfabeto completo** | Etiqueta entera en cirílico que se lee como latina (`аррӏе.com`) |

También descodifica punycode (`xn--80ak6aa92e.com` → `аррӏе.com`) y avisa de los caracteres de ancho completo (`ｇoogle.com`), que el navegador normaliza a ASCII.

## Privacidad

Todo se calcula en tu navegador. Los enlaces de los correos no navegan a ninguna parte y el analizador no visita ni envía nada.

## Estructura

```
index.html    la aplicación (interfaz, test y analizador; ES/EN, tema claro/oscuro)
homoglyph.js  motor de análisis: alfabeto de cada letra, confusables, punycode (RFC 3492)
emails.js     banco de correos del test
icono.png     logo de la casa
```

`homoglyph.js` y `emails.js` también se cargan en Node (`require`), para probar el motor fuera del navegador.

Para probar en local: `python -m http.server` y abre `http://localhost:8000`.

## English

**Phishing Homográfico** is an interactive quiz and domain analyser for homograph (IDN) phishing: domains that swap Latin letters for identical-looking Cyrillic or Greek ones. The quiz shows 10 random emails from a pool of 16 and, after each answer, highlights the impostor letter, its Unicode code point and the `xn--` punycode domain DNS actually sees. The analyser classifies any link, domain or email address (ASCII, normal IDN, other script, mixed scripts, whole-script spoof) and decodes punycode. Everything runs in your browser. Bilingual (ES/EN), light/dark themes.

## Licencia / License

[MIT](LICENSE) © Un Fantasma en el Sistema.
