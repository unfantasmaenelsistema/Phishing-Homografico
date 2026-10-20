/* emails.js — banco de correos del test. La respuesta correcta NO se escribe a mano:
 * sale de Homoglyph.analyze(link).danger, así que nunca puede contradecir al análisis.
 * Los dominios con homógrafos solo se muestran: el enlace no navega a ninguna parte. */
(function (root) {
  'use strict';
  var EMAILS = [
    // ── Homógrafos ─────────────────────────────────────────────
    { id: 'paypal', link: 'https://www.раypal.com/signin/verify', sender: 'service@раypal.com',
      es: { subject: '¡Alerta de seguridad! Su cuenta ha sido limitada', body: 'Hemos detectado un inicio de sesión inusual desde un dispositivo nuevo. Hasta que confirme su identidad no podrá enviar ni recibir pagos.', cta: 'Confirmar mi identidad' },
      en: { subject: 'Security alert! Your account has been limited', body: 'We detected an unusual sign-in from a new device. You will not be able to send or receive payments until you confirm your identity.', cta: 'Confirm my identity' } },
    { id: 'microsoft', link: 'https://login.microsоft.com/rewards/claim', sender: 'rewards@microsоft.com',
      es: { subject: 'Ha ganado 5.000 puntos de Microsoft Rewards', body: '¡Enhorabuena! Su cuenta ha sido seleccionada en el sorteo mensual. Los puntos caducan en 48 horas si no los reclama.', cta: 'Reclamar mis puntos' },
      en: { subject: 'You have won 5,000 Microsoft Rewards points', body: 'Congratulations! Your account was selected in the monthly draw. The points expire in 48 hours if you do not claim them.', cta: 'Claim my points' } },
    { id: 'amazon', link: 'https://www.amazоn.es/gp/confirm-address', sender: 'envios@amazоn.es',
      es: { subject: 'Su pedido está retenido: falta confirmar la dirección', body: 'No hemos podido entregar el pedido 403-7718256. Confirme la dirección de entrega para que lo volvamos a enviar.', cta: 'Confirmar dirección' },
      en: { subject: 'Your order is on hold: address confirmation needed', body: 'We could not deliver order 403-7718256. Confirm the delivery address so we can ship it again.', cta: 'Confirm address' } },
    { id: 'whatsapp', link: 'https://web.whаtsapp.com/view?msg=88213', sender: 'no-reply@whаtsapp.com',
      es: { subject: 'Tiene 3 mensajes de voz sin escuchar', body: 'Alguien le ha enviado mensajes de voz mientras estaba desconectado. Puede escucharlos en la versión web.', cta: 'Escuchar mensajes' },
      en: { subject: 'You have 3 unheard voice messages', body: 'Someone sent you voice messages while you were offline. You can listen to them on the web version.', cta: 'Listen to messages' } },
    { id: 'apple', link: 'https://аррӏе.com/es/account/locked', sender: 'appleid@аррӏе.com',
      es: { subject: 'Su ID de Apple se ha bloqueado por motivos de seguridad', body: 'Se ha intentado iniciar sesión varias veces con una contraseña incorrecta. Desbloquee su cuenta para seguir usando iCloud.', cta: 'Desbloquear mi cuenta' },
      en: { subject: 'Your Apple ID has been locked for security reasons', body: 'There were several sign-in attempts with a wrong password. Unlock your account to keep using iCloud.', cta: 'Unlock my account' } },
    { id: 'netflix-fake', link: 'https://www.netflіx.com/billing/update', sender: 'info@netflіx.com',
      es: { subject: 'No hemos podido cobrar su suscripción', body: 'Su banco ha rechazado el último pago. Actualice su forma de pago para evitar la suspensión del servicio.', cta: 'Actualizar forma de pago' },
      en: { subject: 'We could not charge your subscription', body: 'Your bank declined the last payment. Update your payment method to avoid your service being suspended.', cta: 'Update payment method' } },
    { id: 'bbva-fake', link: 'https://www.bbvа.es/particulares/acceso', sender: 'avisos@bbvа.es',
      es: { subject: 'Movimiento no reconocido de 849,90 €', body: 'Hemos bloqueado un cargo con su tarjeta terminada en 4417. Si no lo ha realizado usted, anúlelo cuanto antes.', cta: 'Anular el cargo' },
      en: { subject: 'Unrecognised transaction of €849.90', body: 'We blocked a charge on your card ending in 4417. If you did not make it, cancel it as soon as possible.', cta: 'Cancel the charge' } },
    { id: 'google-greek', link: 'https://accounts.gοogle.com/signin/recovery', sender: 'no-reply@accounts.gοogle.com',
      es: { subject: 'Alguien tiene su contraseña', body: 'Google ha impedido un intento de inicio de sesión. Le recomendamos cambiar la contraseña de inmediato.', cta: 'Cambiar contraseña' },
      en: { subject: 'Someone has your password', body: 'Google prevented a sign-in attempt. We recommend changing your password immediately.', cta: 'Change password' } },
    { id: 'correos', link: 'https://www.cоrreos.es/envios/aduanas', sender: 'notificaciones@cоrreos.es',
      es: { subject: 'Su paquete está pendiente de pago de aduanas (1,79 €)', body: 'Su envío ES2948120 no se entregará hasta que abone las tasas de aduana. Tiene 2 días antes de que se devuelva al remitente.', cta: 'Pagar 1,79 €' },
      en: { subject: 'Your parcel is awaiting a customs fee (€1.79)', body: 'Your shipment ES2948120 will not be delivered until the customs fee is paid. You have 2 days before it is returned to sender.', cta: 'Pay €1.79' } },
    { id: 'caixa', link: 'https://www.caixabаnk.es/login', sender: 'seguridad@caixabаnk.es',
      es: { subject: 'Actualice su dispositivo de firma', body: 'Por la nueva normativa europea debe volver a vincular su móvil. Si no lo hace hoy, la banca online quedará bloqueada.', cta: 'Vincular mi móvil' },
      en: { subject: 'Update your signing device', body: 'Under new European regulations you must link your phone again. If you do not do it today, online banking will be blocked.', cta: 'Link my phone' } },
    // ── Dominios auténticos ────────────────────────────────────
    { id: 'apple-real', link: 'https://www.apple.com/es/shop/account/home', sender: 'no_reply@email.apple.com',
      es: { subject: 'Su recibo de Apple', body: 'Gracias por su compra de iCloud+ 50 GB (0,99 €). Puede consultar el detalle de la compra en su cuenta.', cta: 'Ver mi cuenta' },
      en: { subject: 'Your receipt from Apple', body: 'Thank you for your iCloud+ 50 GB purchase (€0.99). You can see the purchase details in your account.', cta: 'View my account' } },
    { id: 'google-real', link: 'https://myaccount.google.com/security-checkup', sender: 'no-reply@accounts.google.com',
      es: { subject: 'Revisión de seguridad de su cuenta', body: 'Han pasado 6 meses desde su última revisión. Le recomendamos comprobar los dispositivos conectados.', cta: 'Revisar ahora' },
      en: { subject: 'Your account security checkup', body: 'It has been 6 months since your last checkup. We recommend reviewing your connected devices.', cta: 'Review now' } },
    { id: 'dropbox', link: 'https://www.dropbox.com/terms', sender: 'no-reply@dropbox.com',
      es: { subject: 'Actualizamos nuestros Términos del servicio', body: 'Los nuevos términos entrarán en vigor el próximo mes. No tiene que hacer nada para seguir usando Dropbox.', cta: 'Leer los términos' },
      en: { subject: 'We are updating our Terms of Service', body: 'The new terms take effect next month. You do not need to do anything to keep using Dropbox.', cta: 'Read the terms' } },
    { id: 'netflix-real', link: 'https://www.netflix.com/browse', sender: 'info@mailer.netflix.com',
      es: { subject: 'Nuevo en Netflix esta semana', body: 'Hemos añadido series y películas que creemos que le gustarán según lo que ha visto.', cta: 'Ver novedades' },
      en: { subject: 'New on Netflix this week', body: 'We have added shows and films we think you will like based on what you have watched.', cta: 'See what is new' } },
    { id: 'aeat', link: 'https://sede.agenciatributaria.gob.es/', sender: 'avisos@correo.aeat.es',
      es: { subject: 'Comienza la campaña de la Renta', body: 'Ya puede consultar sus datos fiscales y presentar la declaración desde la Sede electrónica.', cta: 'Ir a la Sede electrónica' },
      en: { subject: 'The income tax campaign has started', body: 'You can now check your tax data and file your return from the electronic office.', cta: 'Go to the electronic office' } },
    { id: 'bbva-real', link: 'https://www.bbva.es/personas.html', sender: 'comunicaciones@bbva.es',
      es: { subject: 'Su extracto mensual ya está disponible', body: 'Puede consultar el extracto de su cuenta en la app o en la web, en el apartado Documentos.', cta: 'Ver extracto' },
      en: { subject: 'Your monthly statement is available', body: 'You can view your account statement in the app or on the website, under Documents.', cta: 'View statement' } }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = EMAILS;
  else root.EMAILS = EMAILS;
})(typeof window !== 'undefined' ? window : this);
