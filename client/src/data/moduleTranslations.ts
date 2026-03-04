/**
 * Multilingual overrides for module content.
 * Provides translations for subtitles, objectives, keyTakeaways, and slide titles.
 * Slide HTML bodies remain in English (technical content with code/tables).
 */

export type TranslationLang = 'zh' | 'es' | 'ne'

export interface ModulePatch {
  subtitle?: string
  objectives?: string[]
  keyTakeaways?: string[]
  slideTitles?: string[]  // replaces slide.title per index
  heroStatLabels?: string[]  // replaces heroStat.label per index
}

type PatchMap = Record<TranslationLang, Record<string, ModulePatch>>

export const MODULE_PATCHES: PatchMap = {
  /* ══════════════════════════════════════
     CHINESE (zh)
  ══════════════════════════════════════ */
  zh: {
    mod1: {
      subtitle: '非技术管理人员的高管入门指南',
      objectives: [
        '在金融科技背景下定义数据泄露',
        '识别四种数据泄露类型',
        '了解攻击者的数据目标',
        '掌握PDPO DPP1–DPP6框架',
        '理解检测时间的重要性',
        '认识暗网数据估值',
      ],
      keyTakeaways: [
        '数据泄露是指未经授权方访问、披露或窃取敏感、受保护或机密信息的任何安全事件。',
        '数字钱包是高价值攻击目标，因为它们在一处汇聚了身份、支付和生物特征数据。',
        '四类泄露：外部攻击、内部威胁、意外披露和实物盗窃。',
        '香港PDPO DPP4创建了实施安全控制以保护个人数据的法律义务。',
        '平均泄露检测时间为277天——每一天未被发现的访问都会增加总成本。',
        '暗网"fullz"套餐售价约310美元——直接证明了攻击者针对数字钱包的商业动机。',
      ],
      slideTitles: [
        '什么是数据泄露？',
        '数据泄露的类型',
        '攻击者想要哪些数据？',
        '香港PDPO框架',
        '泄露生命周期',
        '为什么检测速度至关重要',
      ],
      heroStatLabels: [
        '平均泄露成本 2023 (IBM)',
        '平均泄露识别时间',
        '遭受多次泄露的组织',
        '涉及人为因素',
      ],
    },
    mod2: {
      subtitle: '攻击者如何实际入侵数字钱包系统',
      objectives: [
        '识别针对金融科技的主要攻击向量',
        '了解网络钓鱼和社会工程学技术',
        '识别凭证填充和暴力破解攻击',
        '理解SQL注入和API漏洞',
        '了解供应链和内部威胁风险',
        '将OWASP十大威胁应用于钱包应用场景',
      ],
      keyTakeaways: [
        '网络钓鱼是最主要的攻击向量——36%的泄露始于欺骗性电子邮件或消息。',
        '凭证填充会自动测试泄露的密码，多因素认证（MFA）可以有效阻止它。',
        'SQL注入完全可以预防：使用参数化查询和预处理语句。',
        'BOLA（对象级授权失效）是最高的API安全风险——始终验证资源所有权。',
        '供应链攻击通过危害受信任的第三方供应商来攻击下游目标。',
        '云端配置错误（尤其是公开的存储桶）是意外泄露的主要来源。',
      ],
      slideTitles: [
        '攻击向量 #1：网络钓鱼与社会工程学',
        '攻击向量 #2：凭证填充',
        '攻击向量 #3：SQL注入',
        '攻击向量 #4：API与访问控制漏洞',
        '攻击向量 #5：供应链与云端配置错误',
      ],
      heroStatLabels: [
        '网络钓鱼导致的泄露（Verizon 2024）',
        '重复使用密码的人',
        '（网络钓鱼泄露）平均驻留时间',
        '网络钓鱼泄露的平均成本',
      ],
    },
    mod3: {
      subtitle: '量化数据泄露的真实成本',
      objectives: [
        '了解泄露成本的所有组成部分',
        '将IBM成本分析应用于金融科技场景',
        '计算监管罚款风险（PDPO、GDPR）',
        '量化声誉和客户流失影响',
        '了解股价和市值影响',
        '为安全投资建立商业案例',
      ],
      keyTakeaways: [
        '"业务损失"（客户流失 + 品牌损害）占总泄露成本的39%——是最大的单一类别。',
        '普华永道（2023）：87%的客户会停止使用数据处理不当的金融科技服务；65%即使获得补偿也不会回来。',
        'GDPR最高罚款：2000万欧元或全球年收入的4%——适用于任何处理欧盟居民数据的金融科技公司。',
        '金融服务行业的平均泄露成本最高，达608万美元（IBM 2024）。',
        '现实案例（Equifax、Capital One、Medibank）显示，披露后一周内股价下跌25-35%。',
        '期望价值分析：15%泄露概率 × 600万美元平均成本 = 每年90万美元的预期损失——使安全投资物有所值。',
      ],
      slideTitles: [
        '四类成本',
        '客户信任影响',
        '监管罚款风险',
        '现实世界成本基准',
        '期望价值框架',
      ],
      heroStatLabels: [
        '平均泄露成本（金融服务）',
        '业务损失占比',
        '遭泄露后会停止使用金融科技的客户',
        '最高GDPR罚款（或全球收入4%）',
      ],
    },
    mod4: {
      subtitle: '为数字钱包安全建立多层防御',
      objectives: [
        '实施零信任安全架构',
        '应用最小权限原则',
        '有效部署多因素认证',
        '了解静态和传输中的加密',
        '制定并测试事件响应计划',
        '应用HKMA CFI 2.0合规要求',
      ],
      keyTakeaways: [
        '零信任（"永不信任，始终验证"）平均每次泄露节省222万美元——默认假设已被入侵。',
        '最小权限原则限制了"爆炸半径"——一个被攻陷的账户不应提供对所有内容的访问。',
        '多因素认证（MFA）直接抵御凭证填充和网络钓鱼——是第1和第2主要攻击向量的克星。',
        '静态数据使用AES-256，传输中数据使用TLS 1.2+，密码使用bcrypt/Argon2——切勿在安全场景中使用MD5、SHA-1或Base64。',
        '带12个月日志保留的SIEM支持取证调查，平均减少泄露成本168万美元。',
        '经过测试的事件响应计划是单一最高投资回报率的安全投资（每次泄露节省266万美元）。',
      ],
      slideTitles: [
        '第1层：零信任架构',
        '第2层：身份与访问管理（IAM）',
        '第3层：多因素认证（MFA）',
        '第4层：加密标准',
        '第5层：安全监控（SIEM）',
        '第6层：事件响应计划（IRP）',
      ],
      heroStatLabels: [
        '零信任每次泄露节省（IBM）',
        '经测试IRP每次泄露节省',
        'MFA每次泄露节省（IBM）',
        'HKMA C-RAF评估领域',
      ],
    },
    mod5: {
      subtitle: '现实世界泄露事件及金融科技可汲取的教训',
      objectives: [
        '分析Equifax泄露事件及其根本原因',
        '了解Capital One云端配置错误',
        '研究Medibank勒索软件事件',
        '将经验教训应用于数字钱包环境',
        '将案例研究失败映射到缓解控制措施',
        '制定优先行动路线图',
      ],
      keyTakeaways: [
        'Equifax（2017）：1.47亿条记录因一个78天未修补的漏洞而泄露——补丁管理不容妥协。',
        'Capital One（2019）：通过配置错误的IAM角色泄露了1.06亿条记录——最小权限和云配置审查至关重要。',
        'Medibank（2022）：通过被盗的VPN凭证窃取了970万条记录——在所有远程访问上启用MFA是基准控制。',
        '所有三起泄露的共同线索：单一可预防的控制失败演变成灾难性的数据丢失。',
        '映射练习表明，每一起重大泄露都本可预防——这些不是复杂的、不可避免的攻击。',
        '优先路线图：立即启用MFA（0天），90天内完成SIEM和IRP，持续进行季度审查和年度渗透测试。',
      ],
      slideTitles: [
        '案例研究1：Equifax（2017）',
        '案例研究2：Capital One（2019）',
        '案例研究3：Medibank（2022）',
        '将失败映射到控制措施',
        '您的优先行动路线图',
      ],
      heroStatLabels: [
        '泄露记录数（Equifax）',
        '泄露记录数（Capital One）',
        '泄露记录数（Medibank）',
        'Equifax和解成本',
      ],
    },
  },

  /* ══════════════════════════════════════
     SPANISH (es)
  ══════════════════════════════════════ */
  es: {
    mod1: {
      subtitle: 'Una introducción ejecutiva para gerentes no técnicos',
      objectives: [
        'Definir una filtración de datos en el contexto de FinTech',
        'Identificar los cuatro tipos de filtraciones',
        'Comprender qué datos atacan los adversarios',
        'Conocer el marco PDPO DPP1–DPP6',
        'Comprender la importancia del tiempo de detección',
        'Reconocer las valoraciones de datos en la web oscura',
      ],
      keyTakeaways: [
        'Una filtración de datos es cualquier incidente de acceso no autorizado a información sensible, protegida o confidencial.',
        'Las billeteras digitales son objetivos de alto valor porque agregan identidad, pagos y datos biométricos en un solo lugar.',
        'Los cuatro tipos de filtraciones: ataque externo, amenaza interna, divulgación accidental y robo físico.',
        'El DPP4 de la PDPO de Hong Kong crea una obligación legal de implementar controles de seguridad para proteger los datos personales.',
        'El tiempo promedio de detección es de 277 días — cada día de acceso no detectado aumenta el costo total.',
        'Los paquetes "fullz" en la web oscura se venden por ~US$310 — evidencia directa del incentivo comercial para atacar billeteras digitales.',
      ],
      slideTitles: [
        '¿Qué es una Filtración de Datos?',
        'Tipos de Filtraciones de Datos',
        '¿Qué Datos Quieren los Atacantes?',
        'El Marco PDPO de Hong Kong',
        'El Ciclo de Vida de una Filtración',
        'Por Qué la Velocidad de Detección Importa',
      ],
      heroStatLabels: [
        'Costo promedio de filtración 2023 (IBM)',
        'Tiempo promedio de identificación',
        'Organizaciones filtradas más de una vez',
        'Involucran el elemento humano',
      ],
    },
    mod2: {
      subtitle: 'Cómo los atacantes realmente vulneran los sistemas de billeteras digitales',
      objectives: [
        'Identificar los principales vectores de ataque contra FinTech',
        'Comprender las técnicas de phishing e ingeniería social',
        'Reconocer ataques de relleno de credenciales y fuerza bruta',
        'Comprender SQL injection y vulnerabilidades de API',
        'Conocer los riesgos de cadena de suministro y amenazas internas',
        'Aplicar el OWASP Top 10 al contexto de aplicaciones de billetera',
      ],
      keyTakeaways: [
        'El phishing es el principal vector de ataque — el 36% de las filtraciones comienzan con un correo engañoso.',
        'El relleno de credenciales automatiza el testeo de contraseñas filtradas — la autenticación multifactor (MFA) lo detiene.',
        'La inyección SQL es completamente prevenible: use consultas parametrizadas y declaraciones preparadas.',
        'BOLA (Falta de Autorización a Nivel de Objeto) es el mayor riesgo de seguridad de API — verifique siempre la propiedad del recurso.',
        'Los ataques a la cadena de suministro comprometen proveedores terceros de confianza para atacar clientes posteriores.',
        'La mala configuración en la nube (especialmente depósitos públicos) es la principal fuente de filtraciones accidentales.',
      ],
      slideTitles: [
        'Vector #1: Phishing e Ingeniería Social',
        'Vector #2: Relleno de Credenciales',
        'Vector #3: Inyección SQL',
        'Vector #4: API y Fallos de Control de Acceso',
        'Vector #5: Cadena de Suministro y Mala Configuración en la Nube',
      ],
      heroStatLabels: [
        'Filtraciones vía phishing (Verizon 2024)',
        'Personas que reutilizan contraseñas',
        'Tiempo de residencia promedio (filtración phishing)',
        'Costo promedio de filtración phishing',
      ],
    },
    mod3: {
      subtitle: 'Cuantificando el verdadero costo de las filtraciones de datos',
      objectives: [
        'Comprender todos los componentes del costo de una filtración',
        'Aplicar el análisis de costos de IBM a escenarios FinTech',
        'Calcular la exposición a multas regulatorias (PDPO, GDPR)',
        'Cuantificar el impacto reputacional y la pérdida de clientes',
        'Comprender los efectos sobre el precio de las acciones y la capitalización',
        'Elaborar un argumento comercial para la inversión en seguridad',
      ],
      keyTakeaways: [
        '"Pérdida de negocio" (abandono + daño de marca) representa el 39% del costo total — la categoría individual más grande.',
        'PwC (2023): El 87% dejaría de usar un FinTech que mal manejó sus datos; el 65% no regresaría ni con compensación.',
        'Multa máxima GDPR: €20M o el 4% de los ingresos globales anuales — aplica a cualquier FinTech que procese datos de residentes de la UE.',
        'El sector de servicios financieros enfrenta el mayor costo promedio de filtración: US$6,08M (IBM 2024).',
        'Casos reales (Equifax, Capital One, Medibank) muestran caídas del precio de acciones del 25-35% en una semana.',
        'Análisis de valor esperado: 15% de probabilidad × US$6M promedio = US$900K/año de pérdida esperada — hace la inversión en seguridad rentable.',
      ],
      slideTitles: [
        'Las Cuatro Categorías de Costos',
        'Impacto en la Confianza del Cliente',
        'Exposición a Multas Regulatorias',
        'Benchmarks de Costos en el Mundo Real',
        'El Marco de Valor Esperado',
      ],
      heroStatLabels: [
        'Costo promedio de filtración (Servicios Financieros)',
        'Costo atribuido a pérdida de negocio',
        'Clientes que dejarían de usar FinTech tras filtración',
        'Multa máxima GDPR (o 4% de ingresos globales)',
      ],
    },
    mod4: {
      subtitle: 'Construyendo una defensa por capas para la seguridad de billeteras digitales',
      objectives: [
        'Implementar una arquitectura de seguridad Zero Trust',
        'Aplicar el Principio de Mínimo Privilegio',
        'Desplegar autenticación multifactor de manera efectiva',
        'Comprender el cifrado en reposo y en tránsito',
        'Construir y probar un Plan de Respuesta a Incidentes',
        'Aplicar los requisitos de cumplimiento HKMA CFI 2.0',
      ],
      keyTakeaways: [
        'Zero Trust ("nunca confíes, siempre verifica") ahorra US$2,22M por filtración en promedio — asume brecha por defecto.',
        'El Principio de Mínimo Privilegio limita el "radio de explosión" — una cuenta comprometida no debería acceder a todo.',
        'El MFA derrota directamente el relleno de credenciales y el robo de credenciales por phishing — los vectores #1 y #2.',
        'AES-256 para datos en reposo, TLS 1.2+ para datos en tránsito, bcrypt/Argon2 para contraseñas — nunca use MD5, SHA-1 o Base64 para seguridad.',
        'SIEM con retención de logs de 12 meses reduce el costo de filtración en US$1,68M en promedio.',
        'Un Plan de Respuesta a Incidentes probado es la inversión de seguridad con mayor ROI (ahorra US$2,66M por filtración).',
      ],
      slideTitles: [
        'Capa 1: Arquitectura Zero Trust',
        'Capa 2: Gestión de Identidad y Acceso (IAM)',
        'Capa 3: Autenticación Multifactor (MFA)',
        'Capa 4: Estándares de Cifrado',
        'Capa 5: Monitoreo de Seguridad (SIEM)',
        'Capa 6: Plan de Respuesta a Incidentes (IRP)',
      ],
      heroStatLabels: [
        'Ahorro por filtración con Zero Trust (IBM)',
        'Ahorro por filtración con IRP probado',
        'Ahorro por filtración con MFA (IBM)',
        'Dominios evaluados en HKMA C-RAF',
      ],
    },
    mod5: {
      subtitle: 'Brechas reales y lo que los FinTech pueden aprender de ellas',
      objectives: [
        'Analizar la filtración de Equifax y sus causas raíz',
        'Comprender la mala configuración en la nube de Capital One',
        'Estudiar el incidente de ransomware de Medibank',
        'Aplicar las lecciones aprendidas al contexto de billetera digital',
        'Mapear los fallos de los casos de estudio a controles de mitigación',
        'Construir una hoja de ruta de acciones priorizadas',
      ],
      keyTakeaways: [
        'Equifax (2017): 147M registros expuestos por una vulnerabilidad sin parchear durante 78 días — la gestión de parches no es negociable.',
        'Capital One (2019): 106M registros expuestos por un rol IAM mal configurado — el Mínimo Privilegio y las auditorías de nube son esenciales.',
        'Medibank (2022): 9,7M registros robados con credenciales VPN robadas — MFA en todos los accesos remotos es el control base.',
        'Hilo común en las tres brechas: un solo fallo de control prevenible se convirtió en una pérdida catastrófica de datos.',
        'El ejercicio de mapeo muestra que toda gran brecha podía haberse prevenido — no son ataques sofisticados ni inevitables.',
        'Hoja de ruta: MFA inmediatamente (0 días), SIEM y IRP en 90 días, revisiones trimestrales y pruebas de penetración anuales.',
      ],
      slideTitles: [
        'Caso de Estudio 1: Equifax (2017)',
        'Caso de Estudio 2: Capital One (2019)',
        'Caso de Estudio 3: Medibank (2022)',
        'Mapeando Fallos a Controles',
        'Tu Hoja de Ruta de Acciones Prioritarias',
      ],
      heroStatLabels: [
        'Registros expuestos (Equifax)',
        'Registros expuestos (Capital One)',
        'Registros expuestos (Medibank)',
        'Costo del acuerdo de Equifax',
      ],
    },
  },

  /* ══════════════════════════════════════
     NEPALI (ne)
  ══════════════════════════════════════ */
  ne: {
    mod1: {
      subtitle: 'गैर-प्राविधिक प्रबन्धकहरूका लागि कार्यकारी प्रारम्भिक गाइड',
      objectives: [
        'फिनटेक सन्दर्भमा डेटा उल्लङ्घन परिभाषित गर्नुहोस्',
        'चार प्रकारका उल्लङ्घनहरू पहिचान गर्नुहोस्',
        'आक्रमणकारीहरूले के डेटा लक्ष्य गर्छन् बुझ्नुहोस्',
        'PDPO DPP1–DPP6 फ्रेमवर्क जान्नुहोस्',
        'पत्ता लगाउने समय किन महत्त्वपूर्ण छ बुझ्नुहोस्',
        'डार्क वेब डेटा मूल्याङ्कन पहिचान गर्नुहोस्',
      ],
      keyTakeaways: [
        'डेटा उल्लङ्घन भनेको अनाधिकृत पक्षले संवेदनशील, सुरक्षित वा गोप्य जानकारी पहुँच, प्रकट वा चोरी गर्ने कुनै पनि सुरक्षा घटना हो।',
        'डिजिटल वालेटहरू उच्च-मूल्य लक्ष्य हुन् किनकि तिनीहरूले एउटै स्थानमा पहिचान, भुक्तानी र बायोमेट्रिक डेटा एकत्र गर्छन्।',
        'चार प्रकारका उल्लङ्घनहरू: बाह्य आक्रमण, आन्तरिक खतरा, आकस्मिक प्रकटीकरण र भौतिक चोरी।',
        'हङकङको PDPO DPP4 ले व्यक्तिगत डेटा सुरक्षित गर्न सुरक्षा नियन्त्रणहरू लागू गर्ने कानूनी दायित्व सिर्जना गर्छ।',
        'औसत उल्लङ्घन पत्ता लगाउने समय २७७ दिन हो — हरेक दिन पत्ता नलागेको पहुँचले कुल लागत बढाउँछ।',
        'डार्क वेब "fullz" प्याकेजहरू ~US$३१० मा बिक्री हुन्छन् — डिजिटल वालेट आक्रमण गर्ने व्यावसायिक प्रोत्साहनको प्रत्यक्ष प्रमाण।',
      ],
      slideTitles: [
        'डेटा उल्लङ्घन के हो?',
        'डेटा उल्लङ्घनका प्रकारहरू',
        'आक्रमणकारीहरूले के डेटा चाहन्छन्?',
        'हङकङको PDPO फ्रेमवर्क',
        'उल्लङ्घन जीवनचक्र',
        'पत्ता लगाउने गति किन महत्त्वपूर्ण छ',
      ],
      heroStatLabels: [
        'औसत उल्लङ्घन लागत २०२३ (IBM)',
        'उल्लङ्घन पहिचान गर्न औसत समय',
        'एक पटकभन्दा बढी उल्लङ्घन भएका संस्थाहरू',
        'मानवीय तत्व समावेश',
      ],
    },
    mod2: {
      subtitle: 'आक्रमणकारीहरूले डिजिटल वालेट प्रणालीहरू वास्तवमा कसरी तोड्छन्',
      objectives: [
        'फिनटेक लक्ष्य गर्ने शीर्ष आक्रमण माध्यमहरू पहिचान गर्नुहोस्',
        'फिसिङ र सामाजिक इन्जिनियरिङ प्रविधिहरू बुझ्नुहोस्',
        'क्रेडेन्सियल स्टफिङ र ब्रुट फोर्स आक्रमणहरू चिन्नुहोस्',
        'SQL इन्जेक्सन र API कमजोरीहरू बुझ्नुहोस्',
        'आपूर्ति श्रृंखला र आन्तरिक खतरा जोखिमहरू जान्नुहोस्',
        'वालेट एप सन्दर्भमा OWASP शीर्ष १० लागू गर्नुहोस्',
      ],
      keyTakeaways: [
        'फिसिङ सबैभन्दा ठूलो आक्रमण माध्यम हो — ३६% उल्लङ्घनहरू धोकादायी इमेल वा सन्देशबाट सुरु हुन्छन्।',
        'क्रेडेन्सियल स्टफिङले लीक भएका पासवर्डहरू स्वचालित रूपमा परीक्षण गर्छ — MFA ले यसलाई हराउँछ।',
        'SQL इन्जेक्सन पूर्णतः रोक्न सकिन्छ: प्यारामिटराइज्ड क्वेरी र तयार बयानहरू प्रयोग गर्नुहोस्।',
        'BOLA (टुटेको वस्तु स्तर प्राधिकरण) सबैभन्दा ठूलो API सुरक्षा जोखिम हो — सधैं स्रोत स्वामित्व प्रमाणित गर्नुहोस्।',
        'आपूर्ति श्रृंखला आक्रमणहरूले विश्वसनीय तेस्रो-पक्ष विक्रेताहरूलाई सम्झौता गरेर डाउनस्ट्रिम लक्ष्यहरूमा पुग्छन्।',
        'क्लाउड गलत कन्फिगरेसन (विशेष गरी सार्वजनिक भण्डारण बाल्टिनहरू) आकस्मिक उल्लङ्घनको प्रमुख स्रोत हो।',
      ],
      slideTitles: [
        'आक्रमण माध्यम #१: फिसिङ र सामाजिक इन्जिनियरिङ',
        'आक्रमण माध्यम #२: क्रेडेन्सियल स्टफिङ',
        'आक्रमण माध्यम #३: SQL इन्जेक्सन',
        'आक्रमण माध्यम #४: API र पहुँच नियन्त्रण विफलताहरू',
        'आक्रमण माध्यम #५: आपूर्ति श्रृंखला र क्लाउड गलत कन्फिगरेसन',
      ],
      heroStatLabels: [
        'फिसिङ मार्फत उल्लङ्घनहरू (Verizon २०२४)',
        'पासवर्ड पुनः प्रयोग गर्ने मानिसहरू',
        'औसत ठहराव समय (फिसिङ उल्लङ्घन)',
        'फिसिङ उल्लङ्घनको औसत लागत',
      ],
    },
    mod3: {
      subtitle: 'डेटा उल्लङ्घनको वास्तविक लागत परिमाण गर्दै',
      objectives: [
        'उल्लङ्घन लागतका सम्पूर्ण घटकहरू बुझ्नुहोस्',
        'फिनटेक परिदृश्यहरूमा IBM लागत विश्लेषण लागू गर्नुहोस्',
        'नियामक जरिवाना जोखिम गणना गर्नुहोस् (PDPO, GDPR)',
        'प्रतिष्ठा र ग्राहक गिरावट प्रभाव परिमाण गर्नुहोस्',
        'शेयर मूल्य र बजार पूँजीकरण प्रभाव बुझ्नुहोस्',
        'सुरक्षा लगानीको लागि व्यावसायिक तर्क बनाउनुहोस्',
      ],
      keyTakeaways: [
        '"व्यापार हानि" (ग्राहक गिरावट + ब्रान्ड क्षति) कुल उल्लङ्घन लागतको ३९% हो — एकल सबैभन्दा ठूलो श्रेणी।',
        'PwC (२०२३): ८७% ग्राहकहरूले डेटा दुरुपयोग भएको फिनटेक सेवा बन्द गर्नेछन्; ६५% क्षतिपूर्ति पाएपनि फर्कने छैनन्।',
        'GDPR अधिकतम जरिवाना: €२ करोड वा वैश्विक वार्षिक राजस्वको ४% — EU निवासीहरूको डेटा प्रशोधन गर्ने कुनै पनि फिनटेकमा लागू।',
        'वित्तीय सेवा क्षेत्रले सबैभन्दा उच्च औसत उल्लङ्घन लागत सामना गर्छ: US$६.०८M (IBM २०२४)।',
        'वास्तविक-विश्व उल्लङ्घनहरू (Equifax, Capital One, Medibank) ले प्रकटीकरणको एक हप्तामा शेयर मूल्यमा २५-३५% गिरावट देखाउँछन्।',
        'अपेक्षित मूल्य विश्लेषण: १५% सम्भावना × US$६M = वार्षिक US$९ लाख अपेक्षित हानि — सुरक्षा लगानी ROI-सकारात्मक।',
      ],
      slideTitles: [
        'चार लागत श्रेणीहरू',
        'ग्राहक विश्वास प्रभाव',
        'नियामक जरिवाना जोखिम',
        'वास्तविक विश्व लागत बेन्चमार्कहरू',
        'अपेक्षित मूल्य फ्रेमवर्क',
      ],
      heroStatLabels: [
        'औसत उल्लङ्घन लागत (वित्तीय सेवाहरू)',
        'व्यापार हानिबाट लागत',
        'उल्लङ्घन पछि फिनटेक छोड्ने ग्राहकहरू',
        'अधिकतम GDPR जरिवाना (वा ४% वैश्विक राजस्व)',
      ],
    },
    mod4: {
      subtitle: 'डिजिटल वालेट सुरक्षाको लागि स्तरित रक्षा निर्माण गर्दै',
      objectives: [
        'जिरो ट्रस्ट सुरक्षा वास्तुकला लागू गर्नुहोस्',
        'न्यूनतम विशेषाधिकार सिद्धान्त लागू गर्नुहोस्',
        'बहु-कारक प्रमाणीकरण प्रभावकारी रूपमा तैनाथ गर्नुहोस्',
        'स्थिर र ट्रान्जिटमा इन्क्रिप्सन बुझ्नुहोस्',
        'घटना प्रतिक्रिया योजना बनाउनुहोस् र परीक्षण गर्नुहोस्',
        'HKMA CFI २.० अनुपालन आवश्यकताहरू लागू गर्नुहोस्',
      ],
      keyTakeaways: [
        'जिरो ट्रस्ट ("कहिल्यै विश्वास नगर्नुस्, सधैं प्रमाणित गर्नुस्") प्रति उल्लङ्घन औसत US$२.२२M बचाउँछ।',
        'न्यूनतम विशेषाधिकार सिद्धान्तले "विस्फोट त्रिज्या" सीमित गर्छ — एउटा सम्झौता गरिएको खाताले सबैकुरा पहुँच गर्नु हुँदैन।',
        'MFA ले क्रेडेन्सियल स्टफिङ र फिसिङलाई सिधै हराउँछ — आक्रमण माध्यम #१ र #२ विरुद्ध।',
        'स्थिर डेटाको लागि AES-256, ट्रान्जिटमा TLS 1.2+, पासवर्डको लागि bcrypt/Argon2 — सुरक्षाको लागि MD5, SHA-1 वा Base64 कहिल्यै प्रयोग नगर्नुस्।',
        '१२ महिनाको लग प्रतिधारणसहित SIEM ले फोरेन्सिक अनुसन्धान सक्षम गर्छ र औसत उल्लङ्घन लागत US$१.६८M घटाउँछ।',
        'परीक्षण गरिएको घटना प्रतिक्रिया योजना एकल उच्चतम-ROI सुरक्षा लगानी हो (प्रति उल्लङ्घन US$२.६६M बचाउँछ)।',
      ],
      slideTitles: [
        'तह १: जिरो ट्रस्ट वास्तुकला',
        'तह २: पहिचान र पहुँच व्यवस्थापन (IAM)',
        'तह ३: बहु-कारक प्रमाणीकरण (MFA)',
        'तह ४: इन्क्रिप्सन मानकहरू',
        'तह ५: सुरक्षा अनुगमन (SIEM)',
        'तह ६: घटना प्रतिक्रिया योजना (IRP)',
      ],
      heroStatLabels: [
        'जिरो ट्रस्टसँग प्रति उल्लङ्घन बचत (IBM)',
        'परीक्षण IRP सँग प्रति उल्लङ्घन बचत',
        'MFA सँग प्रति उल्लङ्घन बचत (IBM)',
        'HKMA C-RAF मा मूल्याङ्कन डोमेनहरू',
      ],
    },
    mod5: {
      subtitle: 'वास्तविक-विश्व उल्लङ्घनहरू र फिनटेकहरूले के सिक्न सक्छन्',
      objectives: [
        'Equifax उल्लङ्घन र मूल कारणहरू विश्लेषण गर्नुहोस्',
        'Capital One क्लाउड गलत कन्फिगरेसन बुझ्नुहोस्',
        'Medibank ransomware घटना अध्ययन गर्नुहोस्',
        'सिकेको पाठहरू डिजिटल वालेट सन्दर्भमा लागू गर्नुहोस्',
        'केस स्टडी विफलताहरूलाई शमन नियन्त्रणहरूमा म्याप गर्नुहोस्',
        'प्राथमिकता दिइएको कार्य रोडम्याप निर्माण गर्नुहोस्',
      ],
      keyTakeaways: [
        'Equifax (२०१७): एउटै ७८ दिन नप्याच गरिएको कमजोरीका कारण १४.७ करोड रेकर्ड उजागर — प्याच व्यवस्थापन अपरिहार्य छ।',
        'Capital One (२०१९): गलत कन्फिगर IAM भूमिकाबाट १०.६ करोड रेकर्ड उजागर — न्यूनतम विशेषाधिकार र क्लाउड अडिट आवश्यक।',
        'Medibank (२०२२): चोरी VPN क्रेडेन्सियलमार्फत ९७ लाख रेकर्ड चोरी — सबै रिमोट पहुँचमा MFA आधारभूत नियन्त्रण हो।',
        'तीनवटै उल्लङ्घनको साझा धागो: एउटै रोक्न सकिने नियन्त्रण विफलताले विपत्तिपूर्ण डेटा हानिमा परिणत भयो।',
        'म्यापिङ अभ्यासले देखाउँछ कि प्रत्येक प्रमुख उल्लङ्घन रोक्न सकिन्थ्यो — यी जटिल, अपरिहार्य आक्रमणहरू होइनन्।',
        'प्राथमिकता रोडम्याप: तुरुन्त MFA (० दिन), ९० दिनमा SIEM र IRP, चौमासिक समीक्षा र वार्षिक प्रवेश परीक्षण।',
      ],
      slideTitles: [
        'केस स्टडी १: Equifax (२०१७)',
        'केस स्टडी २: Capital One (२०१९)',
        'केस स्टडी ३: Medibank (२०२२)',
        'विफलतालाई नियन्त्रणमा म्याप गर्दै',
        'तपाईंको प्राथमिकता कार्य रोडम्याप',
      ],
      heroStatLabels: [
        'उजागर रेकर्डहरू (Equifax)',
        'उजागर रेकर्डहरू (Capital One)',
        'उजागर रेकर्डहरू (Medibank)',
        'Equifax सम्झौता लागत',
      ],
    },
  },
}
