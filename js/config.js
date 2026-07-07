/**
 * ============================================================
 * CONFIGURACIÓN DEL NEGOCIO — el único archivo que necesitas editar
 * ============================================================
 * Todo lo marcado con "TODO" debe reemplazarse con datos reales antes
 * de publicar el sitio. Nada de esto requiere saber programar.
 */
window.SITE_CONFIG = {
  // ---------- WhatsApp ----------
  // Número del negocio SIN "+" y sin espacios (código de país + número).
  whatsappNumber: '573128139700',

  // ---------- Correo del dueño ----------
  // A este correo llega la notificación de cada solicitud de cita.
  ownerEmail: 'contacto@centrodealisados.co', // TODO: correo real

  // ---------- EmailJS (envío de correos reales sin backend) ----------
  // 1. Crea una cuenta gratis en https://www.emailjs.com
  // 2. Agrega un "Email Service" (ej. tu Gmail) → copia el Service ID.
  // 3. Crea DOS "Email Templates":
  //    a) Uno dirigido AL CLIENTE confirmando que se recibió su solicitud.
  //    b) Uno dirigido AL DUEÑO avisando que llegó una solicitud nueva.
  //    En cada plantilla usa variables como {{cliente_nombre}}, {{servicio}},
  //    {{fecha}}, {{hora}}, {{cliente_email}}, {{cliente_telefono}} (debajo
  //    se explican todas las que se envían).
  // 4. En Account → General, copia tu "Public Key".
  // 5. Pega los 3 valores aquí abajo. Mientras estén vacíos, el sitio sigue
  //    funcionando (agenda + WhatsApp automático) pero no envía correos.
  emailjs: {
    publicKey: '', // TODO: Public Key de EmailJS
    serviceId: '', // TODO: Service ID de EmailJS
    templateCliente: '', // TODO: Template ID — correo de confirmación al cliente
    templateDueno: '', // TODO: Template ID — correo de notificación al dueño
  },

  // ---------- Horario laboral (alimenta la Agenda) ----------
  businessHours: {
    startMin: 9 * 60, // 9:00am
    endMin: 19 * 60, // 7:00pm (lunes a viernes)
    satEndMin: 17 * 60, // 5:00pm (sábado)
  },
  // Domingo cerrado. TODO: confirmar horario real.

  // ---------- Servicios (alimentan Servicios + Agenda) ----------
  services: [
    { id: 'alisado', name: 'Alisado Saludable', duration: 180, price: null, desc: 'Alisado sin agresiones, cuida la fibra capilar.' },
    { id: 'terapia', name: 'Terapia Capilar', duration: 60, price: null, desc: 'Hidratación y nutrición profunda de mantenimiento.' },
    { id: 'recuperacion', name: 'Recuperación Capilar', duration: 90, price: null, desc: 'Reconstrucción intensiva para cabello dañado.' },
    { id: 'acrilicas', name: 'Uñas Acrílicas', duration: 90, price: null, desc: 'Acrílicas a la medida, acabado prolijo.' },
    { id: 'pressOn', name: 'Press On', duration: 45, price: null, desc: 'Uñas press on personalizadas, listas rápido.' },
  ],
};
