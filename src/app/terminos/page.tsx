"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "es" | "pt" | "en";

const circularMask = {
  mixBlendMode: "screen" as const,
  WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 70%)",
  maskImage: "radial-gradient(circle at center, black 35%, transparent 70%)"
};

const legalDict = {
  es: {
    back: "← Volver a la Tienda",
    badge: "Cumplimiento Normativo y Legal",
    title: "LifePeptidesBo™ – Términos y Condiciones",
    subtitle: "ACUERDO DE TÉRMINOS Y CONDICIONES GENERALES DE USO",
    intro:
      "Estos términos y condiciones rigen el acceso y uso del sitio web oficial de Life Peptides Bolivia (LifePeptidesBo™). Al acceder, navegar o utilizar este sitio web, usted confirma haber leído, comprendido y aceptado estos términos en su totalidad. Si no está de acuerdo con alguno de estos puntos, debe dejar de utilizar este sitio web de inmediato.",
    sections: [
      {
        title: "1. Pagos y Confirmación de Pedidos",
        paragraphs: [
          "Todos los pagos realizados mediante transferencia bancaria, código QR, efectivo o medios digitales autorizados deben efectuarse a las cuentas oficiales proporcionadas por LifePeptidesBo™ al momento de coordinar la orden. Al confirmar un pedido, usted autoriza la transacción por el importe total acordado según los datos proporcionados durante el proceso de solicitud.",
          "Los pedidos cuyos pagos sean confirmados después de las 18:00 (hora de Bolivia, GMT-4) serán procesados el siguiente día hábil. Una vez autorizado y confirmado el pago para despacho, este es definitivo y no puede modificarse ni revertirse. Los clientes deben asegurarse de verificar los montos exactos antes de emitir la transferencia; pagos incompletos o rechazados resultarán en la retención o cancelación del pedido.",
          "Se recomienda encarecidamente a los clientes conservar una copia o captura de su comprobante de pago para futuras consultas y seguimiento."
        ]
      },
      {
        title: "2. Uso de Nuestro Sitio Web",
        paragraphs: [
          "Este sitio web y todo su contenido tienen fines exclusivamente informativos, científicos y educativos. Queda estrictamente prohibido a los usuarios modificar, distribuir, reproducir, publicar, licenciar, transferir o vender cualquier información, imagen, catálogo o servicio obtenido de este sitio web sin el consentimiento expreso y por escrito de LifePeptidesBo™. El uso no autorizado de cualquier material protegido por derechos de propiedad intelectual está estrictamente prohibido y puede dar lugar a acciones legales.",
          "Los usuarios pueden imprimir o descargar fichas técnicas únicamente para uso personal, académico y no comercial, siempre que no se realicen alteraciones y se mantengan intactos todos los avisos de derechos de autor y propiedad intelectual de LifePeptidesBo™."
        ]
      },
      {
        title: "3. Uso de la Información",
        paragraphs: [
          "El contenido disponible en este sitio web (incluyendo descripciones de compuestos y calculadoras de reconstitución) tiene fines exclusivamente de investigación y educativos, y bajo ninguna circunstancia debe considerarse un sustituto del asesoramiento profesional, médico, clínico o científico. Los productos ofrecidos por LifePeptidesBo™ son solo para uso en investigación de laboratorio in vitro y NO están destinados al consumo humano ni animal.",
          "Estos compuestos no están destinados a diagnosticar, tratar, curar ni prevenir ninguna afección médica o enfermedad. Los clientes deben tener en cuenta que LifePeptidesBo™ no realiza ninguna afirmación sobre la eficacia clínica o idoneidad de ningún producto más allá de su uso previsto en investigación de laboratorio. El uso indebido de los productos está estrictamente prohibido.",
          "LifePeptidesBo™ se reserva el derecho de corregir imprecisiones, errores tipográficos o actualizaciones en los listados de productos, descripciones y precios sin previo aviso."
        ]
      },
      {
        title: "4. Descargo de Responsabilidad (Mayoría de Edad +21)",
        paragraphs: [
          "Para acceder, solicitar información o adquirir productos en este sitio web, usted debe ser mayor de 21 años.",
          "Todos los productos comercializados por LifePeptidesBo™ son exclusivamente para fines de investigación in vitro. No están destinados al consumo ni a la aplicación en humanos ni animales. Al realizar un pedido, los clientes reconocen que son totalmente responsables de garantizar que el manejo y uso de estos compuestos cumpla con todas las leyes y normativas vigentes en su respectiva jurisdicción."
        ],
        listIntro: "Los clientes declaran y garantizan además que:",
        list: [
          "Comprenden plenamente la naturaleza química y la aplicación exclusiva de investigación de los productos que están adquiriendo.",
          "Son responsables del cumplimiento de todas las normativas locales, departamentales y nacionales aplicables en relación con la tenencia y uso del producto.",
          "Poseen la formación técnica, el equipamiento y la experiencia necesarios para manipular, almacenar y desechar materiales de investigación de forma segura.",
          "Tomarán todas las precauciones de bioseguridad necesarias para evitar el mal uso o la exposición accidental."
        ],
        footerParagraphs: [
          "LifePeptidesBo™ no ofrece garantías, ni expresas ni implícitas, sobre la comerciabilidad o idoneidad de ningún compuesto para un fin específico ajeno al laboratorio. Los clientes reconocen que estos productos se suministran «tal cual» y que LifePeptidesBo™ no será responsable de daños directos o indirectos que resulten de su uso. En ningún caso LifePeptidesBo™ será responsable de efectos adversos, consecuencias legales o riesgos para la salud derivados del mal uso o la manipulación incorrecta de sus productos.",
          "LifePeptidesBo™ se reserva el derecho estricto de negar el servicio y cancelar pedidos a cualquier persona o entidad sospechosa de uso indebido."
        ]
      },
      {
        title: "5. Uso Estricto del Producto",
        listIntro: "Los compuestos ofrecidos por LifePeptidesBo™ están destinados exclusivamente a fines de investigación de laboratorio y NO están aprobados para:",
        list: [
          "Consumo o administración en seres humanos o animales por ninguna vía.",
          "Uso en alimentos, medicamentos, dispositivos médicos o aplicaciones de diagnóstico clínico.",
          "Cualquier uso comercial, farmacéutico, cosmético directo o terapéutico."
        ],
        paragraphs: [
          "Los clientes reconocen que los productos de LifePeptidesBo™ son reactivos de investigación y no han sido evaluados para comprobar su seguridad o eficacia en aplicaciones médicas, cosméticas o dietéticas en humanos. Los compradores aceptan que bajo ninguna circunstancia utilizarán los productos de manera que infrinja las leyes locales, nacionales o internacionales.",
          "El comprador reconoce que el uso o manejo inadecuado de compuestos químicos de investigación puede acarrear sanciones legales, responsabilidad civil y daños a la salud y la seguridad. Asimismo, LifePeptidesBo™ prohíbe la reventa no autorizada de sus productos sin consentimiento previo por escrito."
        ],
        subListIntro: "Al adquirir en LifePeptidesBo™, el cliente acepta expresamente que:",
        subList: [
          "Está legalmente capacitado y autorizado para adquirir y manipular reactivos químicos para investigación.",
          "Cumplirá rigurosamente con todos los protocolos de seguridad y cadena de frío aplicables.",
          "Asume la plena y exclusiva responsabilidad por todas y cada una de las consecuencias derivadas de la compra, manipulación, almacenamiento o eliminación de estos compuestos."
        ],
        footerParagraphs: [
          "Cualquier evidencia de intento de uso indebido, incluyendo pruebas no autorizadas en humanos o animales, resultará en el bloqueo permanente de futuras compras."
        ]
      },
      {
        title: "6. Responsabilidad e Indemnización",
        paragraphs: [
          "LifePeptidesBo™ no asume ninguna responsabilidad por el uso indebido o fuera de protocolo de sus productos. Los clientes aceptan indemnizar y eximir de toda responsabilidad a LifePeptidesBo™, sus propietarios, afiliados, colaboradores y representantes ante cualquier reclamación, daño, responsabilidad legal o pérdida que resulte de la compra, manipulación, uso o distribución de sus productos.",
          "Los clientes aceptan que LifePeptidesBo™ no será responsable de ningún daño directo, indirecto, incidental o consecuente que surja del uso o la imposibilidad de usar cualquier producto adquirido a través de este sitio web."
        ]
      },
      {
        title: "7. Política de Entrega, Cadena de Frío, Reclamaciones y Cooperación",
        paragraphs: [
          "Confirmación de entrega: Todos los pedidos se despachan coordinando la trazabilidad y el número de guía o seguimiento con el cliente. Un envío se considera entregado correctamente una vez que la empresa transportadora, courier o servicio de entrega confirma la recepción en la dirección o punto de recojo proporcionado por el cliente.",
          "Reclamaciones por entrega: Si el transportista registra un envío como entregado o disponible en agencia pero el cliente informa algún inconveniente, el cliente deberá notificarnos de inmediato (dentro de las primeras 24 horas) para iniciar el rastreo e investigación correspondiente. Las determinaciones y registros oficiales de entrega de la empresa transportadora son definitivos."
        ],
        listIntro: "Cooperación obligatoria del cliente en caso de incidencia de envío:",
        list: [
          "Proporcionar datos exactos y verificables de la dirección de entrega, ciudad y teléfono de contacto.",
          "Retirar oportunamente los paquetes enviados a oficina/agencia para preservar la integridad del envío.",
          "Responder a las solicitudes de verificación y aportar la documentación requerida por la empresa transportadora en caso de extravío."
        ],
        footerParagraphs: [
          "Responsabilidad por el valor del pedido y precisión de la dirección: Los clientes son los únicos responsables de proporcionar una dirección de entrega correcta y segura, así como de recibir el paquete a tiempo. LifePeptidesBo™ no se hace responsable de pérdidas, demoras o deterioro ocasionados por direcciones incorrectas, falta de recojo en agencia o acceso de terceros después de la entrega. Si la empresa de transporte confirma la entrega en el destino indicado, no se emitirán reembolsos ni reemplazos gratuitos.",
          "Envíos de reemplazo: Cuando se ofrezcan de forma excepcional, se proporcionan a nuestra entera discreción y no constituyen una admisión de responsabilidad."
        ]
      },
      {
        title: "8. Cambios en los Términos y Política de Privacidad",
        paragraphs: [
          "Nos reservamos el derecho de actualizar o modificar estos Términos y Condiciones y nuestra Política de Privacidad en cualquier momento. Cualquier cambio se publicará directamente en esta página, y el uso continuado de nuestros servicios implica la aceptación de dichas modificaciones.",
          "Para cualquier consulta relacionada con estos términos, soporte de pedidos o privacidad, puede comunicarse directamente a través de nuestro canal oficial de WhatsApp (+591 76309344)."
        ]
      }
    ],
    footerAbout: "LifePeptidesBo™ es un proveedor especializado en compuestos peptídicos de alta pureza, dedicado a la excelencia en la investigación científica, la trazabilidad molecular y el soporte técnico.",
    copyright: "© Copyright 2026 Life Peptides Bolivia (LifePeptidesBo™). Todos los derechos reservados. Exclusivo para investigación."
  },
  pt: {
    back: "← Voltar para a Loja",
    badge: "Conformidade Regulatória e Legal",
    title: "LifePeptidesBo™ – Termos e Condições",
    subtitle: "ACORDO DE TERMOS E CONDIÇÕES GERAIS DE USO",
    intro:
      "Estes termos e condições regem o uso do site oficial da Life Peptides Bolivia (LifePeptidesBo™). Ao acessar ou usar este site, você confirma que leu, compreendeu e concordou com estes termos. Se não concordar, deve parar de usar este site imediatamente.",
    sections: [
      {
        title: "1. Pagamentos e Confirmação de Pedidos",
        paragraphs: [
          "Todos os pagamentos realizados por transferência bancária, QR ou meios digitais autorizados devem ser feitos para as contas oficiais informadas pela LifePeptidesBo™. Ao confirmar um pedido, você autoriza a transação pelo valor total acordado.",
          "Os pagamentos confirmados após as 18:00 (horário da Bolívia) serão processados no próximo dia útil. Uma vez autorizado e confirmado o pagamento, ele é definitivo e não pode ser alterado ou revertido. Recomenda-se que os clientes guardem uma cópia do comprovante de pagamento."
        ]
      },
      {
        title: "2. Uso do Nosso Site",
        paragraphs: [
          "Este site e seu conteúdo têm fins exclusivamente informativos e educativos. É estritamente proibido modificar, distribuir, reproduzir, publicar, licenciar, transferir ou vender qualquer informação, produto ou serviço obtido neste site sem o consentimento expresso por escrito da LifePeptidesBo™.",
          "Os usuários podem imprimir ou baixar materiais apenas para uso pessoal e não comercial, desde que nenhuma alteração seja feita e todos os avisos de direitos autorais sejam mantidos intactos."
        ]
      },
      {
        title: "3. Uso das Informações",
        paragraphs: [
          "O conteúdo disponível neste site tem fins exclusivamente de pesquisa e educativos, e não deve ser considerado um substituto para aconselhamento profissional, médico ou científico. Os produtos oferecidos pela LifePeptidesBo™ são apenas para uso em pesquisa de laboratório in vitro e NÃO se destinam ao consumo humano ou animal.",
          "Estes produtos não se destinam a diagnosticar, tratar, curar ou prevenir qualquer condição médica. O uso indevido dos produtos é estritamente proibido."
        ]
      },
      {
        title: "4. Isenção de Responsabilidade (+21 Anos)",
        paragraphs: [
          "Para usar este site e adquirir produtos, você deve ter mais de 21 anos.",
          "Todos os produtos vendidos pela LifePeptidesBo™ são exclusivamente para fins de pesquisa in vitro. Ao comprar neste site, os clientes reconhecem que são totalmente responsáveis por garantir que o uso destes produtos cumpra todas as leis vigentes em suas jurisdições."
        ],
        listIntro: "Os clientes declaram e garantem ainda que:",
        list: [
          "Compreendem plenamente a natureza e a aplicação de pesquisa pretendida dos produtos que estão adquirindo.",
          "São responsáveis pelo cumprimento de todas as leis locais e nacionais aplicáveis.",
          "Possuem a formação e a experiência necessárias para manipular, armazenar e descartar materiais de pesquisa com segurança.",
          "Tomarão todas as precauções de segurança necessárias para evitar o mau uso ou exposição acidental."
        ],
        footerParagraphs: [
          "A LifePeptidesBo™ reserva-se o direito de recusar o serviço a qualquer pessoa ou entidade suspeita de uso indevido."
        ]
      },
      {
        title: "5. Uso do Produto",
        listIntro: "Os produtos vendidos pela LifePeptidesBo™ destinam-se exclusivamente a fins de pesquisa laboratorial e NÃO são aprovados para:",
        list: [
          "Consumo humano ou animal.",
          "Uso em alimentos, medicamentos, dispositivos médicos ou aplicações de diagnóstico.",
          "Qualquer uso comercial, farmacêutico ou terapêutico."
        ],
        paragraphs: [
          "Qualquer evidência de tentativa ou uso indevido, incluindo testes não autorizados em humanos ou animais, resultará na proibição permanente de compras futuras."
        ]
      },
      {
        title: "6. Responsabilidade e Indenização",
        paragraphs: [
          "A LifePeptidesBo™ não assume nenhuma responsabilidade pelo uso indevido de seus produtos. Os clientes concordam em indenizar e isentar a LifePeptidesBo™, seus proprietários e afiliados de qualquer reclamação, dano ou perda resultante da compra, manuseio ou uso de seus produtos."
        ]
      },
      {
        title: "7. Política de Entrega, Reclamações e Cooperação do Cliente",
        paragraphs: [
          "Todos os pedidos são enviados com código de rastreamento. Uma remessa é considerada entregue corretamente assim que a transportadora confirma a entrega no endereço ou agência fornecida pelo cliente.",
          "Os clientes são os únicos responsáveis por fornecer um endereço de entrega correto e seguro. Não nos responsabilizamos por perdas causadas por endereços incorretos ou falta de retirada na transportadora."
        ]
      },
      {
        title: "8. Alterações e Contato",
        paragraphs: [
          "Reservamo-nos o direito de atualizar estes Termos e Condições a qualquer momento. Para qualquer dúvida, entre em contato pelo nosso WhatsApp oficial (+591 76309344)."
        ]
      }
    ],
    footerAbout: "A LifePeptidesBo™ é uma fornecedora líder de produtos peptídicos de alta pureza, dedicada à excelência em pesquisa, desenvolvimento e satisfação do cliente.",
    copyright: "© Copyright 2026 Life Peptides Bolivia (LifePeptidesBo™). Todos os direitos reservados."
  },
  en: {
    back: "← Back to Store",
    badge: "Regulatory & Legal Compliance",
    title: "LifePeptidesBo™ – Terms and Conditions",
    subtitle: "GENERAL TERMS AND CONDITIONS OF USE AGREEMENT",
    intro:
      "These terms and conditions govern the use of the official Life Peptides Bolivia (LifePeptidesBo™) website. By accessing or using this website, you confirm that you have read, understood, and agreed to these terms. If you do not agree, you must stop using this website immediately.",
    sections: [
      {
        title: "1. Payments & Order Confirmation",
        paragraphs: [
          "All payments via bank transfer, QR code, or authorized digital methods must be made to the official accounts provided by LifePeptidesBo™. By placing an order, you authorize the transaction for the full amount of your order.",
          "Payments confirmed after 6:00 PM (Bolivia Time, GMT-4) will be processed the next business day. Once payment is authorized and confirmed, it is final and cannot be modified or reversed. Customers are strongly encouraged to keep a copy of their payment confirmation for future reference."
        ]
      },
      {
        title: "2. Use of Our Website",
        paragraphs: [
          "This website and its content are for informational and educational purposes only. Users are strictly prohibited from modifying, distributing, reproducing, publishing, licensing, transferring, or selling any information, product, or service obtained from this website without the express written consent of LifePeptidesBo™.",
          "Users may print or download materials for personal, non-commercial use only, provided no alterations are made and all copyright and intellectual property notices remain intact."
        ]
      },
      {
        title: "3. Use of Information",
        paragraphs: [
          "The content available on this website is strictly for research and educational purposes and should not be considered a substitute for professional, medical, or scientific advice. Products offered by LifePeptidesBo™ are for in vitro laboratory research use only and are NOT intended for human or animal consumption.",
          "These products have not been evaluated by regulatory medical agencies to diagnose, treat, cure, or prevent any medical condition. Misuse of products is strictly prohibited."
        ]
      },
      {
        title: "4. Disclaimer (Age 21+)",
        paragraphs: [
          "You must be at least 21 years old to use this website.",
          "All products sold by LifePeptidesBo™ are strictly for in vitro research purposes. They are not intended for use in humans or animals. By purchasing on this website, customers acknowledge that they are fully responsible for ensuring that the use of these products complies with all applicable laws in their jurisdiction."
        ],
        listIntro: "Customers further represent and warrant that:",
        list: [
          "They fully understand the nature and intended research application of the products they are purchasing.",
          "They are responsible for compliance with all applicable local, state, and national laws regarding product use.",
          "They possess the necessary training and expertise to safely handle, store, and dispose of research materials.",
          "All necessary safety precautions will be taken to prevent misuse or unintended exposure."
        ],
        footerParagraphs: [
          "LifePeptidesBo™ reserves the right to refuse service to anyone suspected of misuse. Customers must be at least 21 years old to place an order."
        ]
      },
      {
        title: "5. Product Use",
        listIntro: "Products sold by LifePeptidesBo™ are intended strictly for laboratory research purposes and are NOT approved for:",
        list: [
          "Human or animal consumption.",
          "Use in foods, drugs, medical devices, or diagnostic applications.",
          "Any commercial, pharmaceutical, or therapeutic use."
        ],
        paragraphs: [
          "Any evidence of attempted or actual misuse, including unauthorized testing in humans or animals, may result in a permanent ban from future purchases and legal action."
        ]
      },
      {
        title: "6. Liability and Indemnification",
        paragraphs: [
          "LifePeptidesBo™ assumes no liability for the misuse of its products. Customers agree to indemnify and hold harmless LifePeptidesBo™, its owners, affiliates, employees, and agents from any claim, damage, liability, or loss resulting from the purchase, handling, use, or distribution of its products."
        ]
      },
      {
        title: "7. Delivery Policy, Claims & Customer Cooperation",
        paragraphs: [
          "All orders are shipped with tracking information. A shipment is considered successfully delivered once the carrier confirms delivery at the address or pickup office provided by the customer.",
          "Customers are solely responsible for providing an accurate and secure delivery address. We are not responsible for losses caused by incorrect addresses, uncollected packages, or third-party access after delivery."
        ]
      },
      {
        title: "8. Changes to Terms & Contact Information",
        paragraphs: [
          "We reserve the right to update or modify these Terms and Conditions at any time. For any inquiries regarding these terms or privacy, please contact us via our official WhatsApp (+591 76309344)."
        ]
      }
    ],
    footerAbout: "LifePeptidesBo™ is a leading provider of high-purity peptide compounds, dedicated to excellence in research, development, and customer satisfaction.",
    copyright: "© Copyright 2026 Life Peptides Bolivia (LifePeptidesBo™). All rights reserved. For research use only."
  }
};

export default function TerminosPage() {
  const [lang, setLang] = useState<Lang>("es");
  const t = legalDict[lang];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white-lp font-sans flex flex-col justify-between">
      {/* BARRA SUPERIOR */}
      <nav className="sticky top-0 z-40 bg-[#111a2e]/95 backdrop-blur-md border-b border-gold/20 px-4 sm:px-8 md:px-16 py-3 flex justify-between items-center shadow-lg">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-16 sm:w-20">
            <img src="/logo.jpeg" alt="Life Peptides" className="w-full h-auto" style={circularMask} />
          </div>
          <span className="text-xs sm:text-sm text-gold-light group-hover:text-gold tracking-[2px] uppercase transition-colors">
            {t.back}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="bg-[#0a0f1c] text-gold border border-gold/30 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
          >
            <option value="es">ES</option>
            <option value="pt">PT</option>
            <option value="en">EN</option>
          </select>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-14 border-b border-gold/20 pb-8">
          <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-[10px] sm:text-xs uppercase tracking-[3px] px-3.5 py-1 rounded-full mb-4">
            {t.badge}
          </span>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl text-gold-light tracking-[2px] font-light mb-3">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm tracking-[3px] text-gold uppercase font-semibold">
            {t.subtitle}
          </p>
        </div>

        {/* CAJA DE INTRODUCCIÓN DESTACADA */}
        <div className="bg-[#111a2e] border-l-4 border-gold p-5 sm:p-6 rounded-r-xl mb-10 text-xs sm:text-sm text-white-lp/85 leading-relaxed shadow-md">
          {t.intro}
        </div>

        {/* SECCIONES LEGALES */}
        <div className="space-y-8">
          {t.sections.map((sec, idx) => (
            <section
              key={idx}
              className="bg-[#0f172a]/90 border border-gold/15 rounded-xl p-5 sm:p-7 space-y-4 shadow-md"
            >
              <h2 className="font-display text-lg sm:text-xl text-gold-light tracking-wide border-b border-gold/15 pb-2.5">
                {sec.title}
              </h2>

              {sec.paragraphs &&
                sec.paragraphs.map((p, i) => (
                  <p key={i} className="text-xs sm:text-sm text-white-lp/75 leading-relaxed">
                    {p}
                  </p>
                ))}

              {sec.listIntro && (
                <p className="text-xs sm:text-sm text-gold/90 font-semibold pt-1">
                  {sec.listIntro}
                </p>
              )}

              {sec.list && (
                <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-white-lp/80 pl-2">
                  {sec.list.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {sec.subListIntro && (
                <p className="text-xs sm:text-sm text-gold/90 font-semibold pt-2">
                  {sec.subListIntro}
                </p>
              )}

              {sec.subList && (
                <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-white-lp/80 pl-2">
                  {sec.subList.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {sec.footerParagraphs &&
                sec.footerParagraphs.map((fp, i) => (
                  <p key={i} className="text-xs sm:text-sm text-white-lp/75 leading-relaxed pt-1">
                    {fp}
                  </p>
                ))}
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-gold hover:bg-gold-light text-navy font-bold text-xs uppercase tracking-[2px] px-8 py-4 rounded-lg transition-all shadow-[0_6px_25px_rgba(203,161,92,0.3)]"
          >
            {t.back}
          </Link>
        </div>
      </main>

      {/* PIE DE PÁGINA ESTILO PEPTIDES WORLD ADAPTADO A LIFE PEPTIDES BO */}
      <footer className="bg-[#111a2e] border-t border-gold/15 py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="w-28 mx-auto">
            <img src="/logo.jpeg" alt="Life Peptides" className="w-full h-auto" style={circularMask} />
          </div>
          <p className="text-xs sm:text-sm text-white-lp/70 max-w-2xl mx-auto leading-relaxed">
            {t.footerAbout}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-[2px] text-gold/80 pt-2">
            <Link href="/#productos" className="hover:text-gold-light">Catálogo</Link>
            <Link href="/#ciencia" className="hover:text-gold-light">Ciencia</Link>
            <Link href="/#beneficios" className="hover:text-gold-light">Beneficios</Link>
            <Link href="/terminos" className="hover:text-gold-light underline">Términos y Condiciones</Link>
          </div>
          <p className="text-[11px] text-white-lp/40 pt-4 border-t border-gold/10">
            {t.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}