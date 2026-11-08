/* Website languages. Translates exact English text on the page and
   remembers the visitor's choice. Table order: es, fr, ht, zh, pt. */
(function () {
  const COLUMN = { es: 0, fr: 1, ht: 2, zh: 3, pt: 4 };
  const NAMES = { en: "English", es: "Español", fr: "Français", ht: "Kreyòl", zh: "中文", pt: "Português" };

  const TEXT = {
    "Logistics marketplace for travelers & senders": ["Mercado logístico para viajeros y remitentes", "Plateforme logistique pour voyageurs et expéditeurs", "Mache lojistik pou vwayajè ak moun k ap voye koli", "面向旅行者和寄件人的物流平台", "Marketplace logístico para viajantes e remetentes"],
    "About": ["Acerca de", "À propos", "Konsènan", "关于", "Sobre"],
    "Sender": ["Remitente", "Expéditeur", "Moun k ap voye", "寄件人", "Remetente"],
    "Traveler": ["Viajero", "Voyageur", "Vwayajè", "旅行者", "Viajante"],
    "Login": ["Iniciar sesión", "Connexion", "Konekte", "登录", "Entrar"],
    "Sign Up": ["Registrarse", "S'inscrire", "Enskri", "注册", "Cadastrar"],
    "Someone's already going there.": ["Alguien ya va para allá.", "Quelqu'un y va déjà.", "Gen yon moun ki deja prale la.", "已经有人要去那里了。", "Alguém já está indo para lá."],
    "Send with verified travelers already on that route, or get paid for a trip you're already taking.": ["Envía con viajeros verificados que ya van por esa ruta, o gana dinero por un viaje que ya ibas a hacer.", "Envoyez avec des voyageurs vérifiés déjà sur ce trajet, ou soyez payé pour un voyage que vous faites déjà.", "Voye ak vwayajè verifye ki deja sou wout sa a, oswa fè lajan sou yon vwayaj ou t ap fè deja.", "交给已在该路线上的认证旅行者寄送，或通过您本来就要走的行程赚钱。", "Envie com viajantes verificados que já estão nessa rota, ou ganhe dinheiro com uma viagem que você já faria."],
    "Every day, people travel with room to spare. And every day, someone needs a package to reach the same place. FlexaGo brings them together.": ["Cada día, hay personas que viajan con espacio de sobra. Y cada día, alguien necesita que un paquete llegue a ese mismo lugar. FlexaGo los une.", "Chaque jour, des gens voyagent avec de la place en trop. Et chaque jour, quelqu'un a besoin de faire parvenir un colis au même endroit. FlexaGo les réunit.", "Chak jou, gen moun ki vwayaje ak plas ki rete. Epi chak jou, gen yon moun ki bezwen voye yon koli nan menm kote a. FlexaGo mete yo ansanm.", "每天都有人带着富余的空间出行，也每天都有人需要把包裹送到同一个地方。FlexaGo 将他们连接在一起。", "Todos os dias, pessoas viajam com espaço de sobra. E todos os dias, alguém precisa que um pacote chegue ao mesmo lugar. A FlexaGo une essas pessoas."],
    "Senders post what needs to go and where. Travelers see deliveries along their route and choose the ones that fit their trip.": ["Los remitentes publican qué hay que enviar y a dónde. Los viajeros ven las entregas en su ruta y eligen las que encajan con su viaje.", "Les expéditeurs indiquent ce qu'il faut envoyer et où. Les voyageurs voient les livraisons sur leur trajet et choisissent celles qui leur conviennent.", "Moun k ap voye yo poste sa ki pou ale ak ki kote. Vwayajè yo wè livrezon ki sou wout yo epi yo chwazi sa ki bon pou vwayaj yo.", "寄件人发布要寄送的物品和目的地。旅行者查看沿途的配送任务，并选择适合自己行程的订单。", "Os remetentes publicam o que precisa ser enviado e para onde. Os viajantes veem as entregas na sua rota e escolhem as que combinam com a viagem."],
    "Every member verifies their identity, and travelers pass a background check before their first job, so you know who you're dealing with.": ["Cada miembro verifica su identidad y los viajeros pasan una verificación de antecedentes antes de su primer trabajo, para que sepas con quién tratas.", "Chaque membre vérifie son identité et les voyageurs passent une vérification des antécédents avant leur première mission : vous savez à qui vous avez affaire.", "Chak manm verifye idantite yo, epi vwayajè yo pase yon verifikasyon dosye anvan premye travay yo, konsa ou konnen ak ki moun w ap fè afè.", "每位会员都要验证身份，旅行者在接第一单前还须通过背景调查，让您清楚对方是谁。", "Todo membro verifica sua identidade e os viajantes passam por uma verificação de antecedentes antes do primeiro trabalho, para você saber com quem está lidando."],
    "Real people, helping real people, on trips already happening.": ["Personas reales ayudando a personas reales, en viajes que ya están en marcha.", "De vraies personnes qui aident de vraies personnes, sur des trajets déjà prévus.", "Moun tout bon k ap ede moun tout bon, nan vwayaj ki deja ap fèt.", "真实的人帮助真实的人，就在已经发生的行程中。", "Pessoas reais ajudando pessoas reais, em viagens que já estão acontecendo."],
    "Get Started": ["Comenzar", "Commencer", "Kòmanse", "开始使用", "Começar"],
    "Learn More": ["Más información", "En savoir plus", "Aprann plis", "了解更多", "Saiba mais"],
    "Post your delivery": ["Publica tu envío", "Publiez votre livraison", "Poste livrezon ou", "发布您的配送", "Publique sua entrega"],
    "A traveler picks it up": ["Un viajero lo recoge", "Un voyageur le récupère", "Yon vwayajè pran l", "旅行者取件", "Um viajante retira"],
    "On the way": ["En camino", "En route", "Sou wout", "运送途中", "A caminho"],
    "Delivered and confirmed": ["Entregado y confirmado", "Livré et confirmé", "Livre epi konfime", "已送达并确认", "Entregue e confirmado"],
    "About FlexaGo": ["Acerca de FlexaGo", "À propos de FlexaGo", "Konsènan FlexaGo", "关于 FlexaGo", "Sobre a FlexaGo"],
    "For Senders": ["Para remitentes", "Pour les expéditeurs", "Pou moun k ap voye", "寄件人专区", "Para remetentes"],
    "Ship anything, anywhere — today.": ["Envía lo que sea, a donde sea, hoy.", "Envoyez tout, partout, dès aujourd'hui.", "Voye nenpòt bagay, nenpòt kote, jodi a.", "今天就把物品寄到任何地方。", "Envie qualquer coisa, para qualquer lugar, hoje."],
    "FlexaGo lets you send packages, documents, and goods using real travelers already heading your way. Faster than traditional couriers, and up to 60% cheaper.": ["FlexaGo te permite enviar paquetes, documentos y productos con viajeros reales que ya van en tu dirección. Más rápido que los mensajeros tradicionales y hasta un 60% más barato.", "FlexaGo vous permet d'envoyer colis, documents et marchandises avec de vrais voyageurs déjà en route. Plus rapide que les transporteurs classiques et jusqu'à 60 % moins cher.", "FlexaGo pèmèt ou voye koli, dokiman ak machandiz ak vrè vwayajè ki deja prale nan direksyon ou. Pi vit pase kourye tradisyonèl, jiska 60% pi bon mache.", "通过 FlexaGo，您可以请顺路的真实旅行者寄送包裹、文件和货物。比传统快递更快，最多便宜 60%。", "A FlexaGo permite enviar pacotes, documentos e produtos com viajantes reais que já vão na sua direção. Mais rápido que as transportadoras tradicionais e até 60% mais barato."],
    "Same-Day Delivery": ["Entrega el mismo día", "Livraison le jour même", "Livrezon menm jou", "当日送达", "Entrega no mesmo dia"],
    "Match with a verified traveler heading to your destination today. No warehouses. No waiting. Your package moves when they move.": ["Conecta con un viajero verificado que va hoy a tu destino. Sin almacenes. Sin esperas. Tu paquete se mueve cuando ellos se mueven.", "Trouvez un voyageur vérifié qui se rend à votre destination aujourd'hui. Pas d'entrepôt. Pas d'attente. Votre colis part avec lui.", "Jwenn yon vwayajè verifye ki prale kote ou vle a jodi a. Pa gen depo. Pa gen tann. Koli ou deplase lè l deplase.", "匹配今天前往您目的地的已验证旅行者。无需仓库，无需等待，旅行者出发，包裹就出发。", "Encontre um viajante verificado que vai hoje ao seu destino. Sem armazéns. Sem espera. Seu pacote vai quando ele vai."],
    "Save Up to 60%": ["Ahorra hasta un 60%", "Économisez jusqu'à 60 %", "Ekonomize jiska 60%", "最多节省 60%", "Economize até 60%"],
    "No fleet overhead. No legacy carrier markup. FlexaGo passes the savings directly to you — every single time.": ["Sin costos de flota. Sin recargos de transportistas tradicionales. FlexaGo te traslada el ahorro, siempre.", "Pas de flotte à financer. Pas de marge des transporteurs classiques. FlexaGo vous fait profiter des économies, à chaque fois.", "Pa gen frè flòt. Pa gen majorasyon ansyen transpòtè. FlexaGo ba ou ekonomi an chak fwa.", "没有车队成本，也没有传统承运商的加价。FlexaGo 每次都把节省的费用直接让给您。", "Sem custos de frota. Sem a margem das transportadoras tradicionais. A FlexaGo repassa a economia para você, sempre."],
    "Real-Time Tracking": ["Seguimiento en tiempo real", "Suivi en temps réel", "Swivi an tan reyèl", "实时跟踪", "Rastreamento em tempo real"],
    "Watch your package move live on the map. Get notified at every milestone — pickup, in transit, and delivered.": ["Mira tu paquete moverse en vivo en el mapa. Recibe avisos en cada etapa: recogida, en tránsito y entregado.", "Suivez votre colis en direct sur la carte. Soyez averti à chaque étape : retrait, transit et livraison.", "Gade koli ou deplase an dirèk sou kat la. Resevwa notifikasyon nan chak etap — ranmase, an wout, livre.", "在地图上实时查看包裹动向，并在取件、运输和送达时收到通知。", "Veja seu pacote em movimento no mapa ao vivo. Receba avisos em cada etapa: coleta, em trânsito e entregue."],
    "Verified & Guaranteed": ["Verificado y garantizado", "Vérifié et garanti", "Verifye ak garanti", "已验证且有保障", "Verificado e garantido"],
    "Every traveler passes Stripe Identity verification. Every delivery is backed by FlexaGo's delivery guarantee.": ["Cada viajero pasa la verificación de Stripe Identity. Cada entrega cuenta con la garantía de FlexaGo.", "Chaque voyageur passe la vérification Stripe Identity. Chaque livraison bénéficie de la garantie FlexaGo.", "Chak vwayajè pase verifikasyon Stripe Identity. Chak livrezon gen garanti FlexaGo.", "每位旅行者都通过 Stripe Identity 验证。每次配送都有 FlexaGo 配送保障。", "Todo viajante passa pela verificação Stripe Identity. Toda entrega conta com a garantia da FlexaGo."],
    "How Sending Works": ["Cómo funciona el envío", "Comment fonctionne l'envoi", "Kijan voye koli mache", "寄件流程", "Como funciona o envio"],
    "Post your delivery — item details, pickup & drop-off location": ["Publica tu entrega: detalles del artículo, recogida y destino", "Publiez votre livraison : détails de l'article, lieux de retrait et de dépôt", "Pibliye livrezon ou — detay atik, kote pou ranmase ak depoze", "发布配送：物品详情、取件和送达地点", "Publique sua entrega: detalhes do item, coleta e destino"],
    "FlexaGo matches you with a verified traveler heading that way": ["FlexaGo te conecta con un viajero verificado que va en esa dirección", "FlexaGo vous met en relation avec un voyageur vérifié allant dans cette direction", "FlexaGo konekte ou ak yon vwayajè verifye ki prale nan direksyon an", "FlexaGo 为您匹配顺路的已验证旅行者", "A FlexaGo conecta você a um viajante verificado que vai nessa direção"],
    "Track your package live as the traveler picks it up and delivers": ["Sigue tu paquete en vivo mientras el viajero lo recoge y entrega", "Suivez votre colis en direct pendant le retrait et la livraison", "Swiv koli ou an dirèk pandan vwayajè a ranmase l ak livre l", "在旅行者取件和送达时实时跟踪包裹", "Acompanhe seu pacote ao vivo enquanto o viajante coleta e entrega"],
    "Confirm delivery, rate your traveler — done ✅": ["Confirma la entrega, califica al viajero y listo ✅", "Confirmez la livraison, évaluez le voyageur, c'est fait ✅", "Konfime livrezon an, bay vwayajè a nòt — fini ✅", "确认送达，评价旅行者——完成 ✅", "Confirme a entrega, avalie o viajante — pronto ✅"],
    "Send a Package →": ["Enviar un paquete →", "Envoyer un colis →", "Voye yon koli →", "寄送包裹 →", "Enviar um pacote →"],
    "For Travelers": ["Para viajeros", "Pour les voyageurs", "Pou vwayajè", "旅行者专区", "Para viajantes"],
    "Your trip. Your route. Your earnings.": ["Tu viaje. Tu ruta. Tus ganancias.", "Votre trajet. Votre itinéraire. Vos gains.", "Vwayaj ou. Wout ou. Lajan ou.", "您的行程，您的路线，您的收入。", "Sua viagem. Sua rota. Seus ganhos."],
    "You're already going somewhere — FlexaGo lets you earn money on every trip by delivering packages along your existing route. No extra miles, just extra income.": ["Ya vas a algún lado: FlexaGo te permite ganar dinero en cada viaje entregando paquetes en tu ruta. Sin millas extra, solo ingresos extra.", "Vous allez déjà quelque part : FlexaGo vous permet de gagner de l'argent à chaque trajet en livrant des colis sur votre itinéraire. Pas de kilomètres en plus, juste un revenu en plus.", "Ou deja prale yon kote — FlexaGo pèmèt ou fè lajan nan chak vwayaj lè ou livre koli sou wout ou. Pa gen mil anplis, sèlman revni anplis.", "您本来就要出门——通过 FlexaGo，您可以在既定路线上配送包裹，每次出行都能赚钱。无需多跑，只有额外收入。", "Você já vai a algum lugar: a FlexaGo permite ganhar dinheiro em cada viagem entregando pacotes na sua rota. Sem quilômetros extras, só renda extra."],
    "Earn on Every Trip": ["Gana en cada viaje", "Gagnez à chaque trajet", "Fè lajan nan chak vwayaj", "每次出行都赚钱", "Ganhe em cada viagem"],
    "Pick up packages along your route and earn extra income — whether you're driving across town or flying across the country.": ["Recoge paquetes en tu ruta y gana ingresos extra, ya sea que cruces la ciudad en auto o el país en avión.", "Récupérez des colis sur votre itinéraire et gagnez un revenu en plus, que vous traversiez la ville en voiture ou le pays en avion.", "Ranmase koli sou wout ou epi fè lajan anplis — kit w ap kondui nan vil la, kit w ap vole travèse peyi a.", "沿途取件，赚取额外收入——无论是开车穿城还是飞越全国。", "Colete pacotes na sua rota e ganhe renda extra, seja dirigindo pela cidade ou voando pelo país."],
    "You Set Your Schedule": ["Tú decides tu horario", "Vous fixez votre horaire", "Ou fikse orè ou", "时间由您决定", "Você define seu horário"],
    "No shifts. No quotas. Post your trip and accept only the deliveries that fit perfectly into your plans.": ["Sin turnos. Sin cuotas. Publica tu viaje y acepta solo las entregas que encajen en tus planes.", "Pas d'horaires imposés. Pas de quotas. Indiquez votre trajet et acceptez seulement les livraisons qui vous conviennent.", "Pa gen orè. Pa gen kota. Mete vwayaj ou epi aksepte sèlman livrezon ki mache ak plan ou.", "没有班次，没有指标。发布行程，只接受适合您计划的配送。", "Sem turnos. Sem metas. Publique sua viagem e aceite só as entregas que se encaixam nos seus planos."],
    "Safe & Supported": ["Seguro y con apoyo", "En sécurité et accompagné", "An sekirite ak sipò", "安全有保障", "Seguro e com suporte"],
    "Every sender is verified. You're covered by FlexaGo delivery insurance and 24/7 live support on every accepted job.": ["Cada remitente está verificado. Tienes el seguro de entrega de FlexaGo y soporte en vivo 24/7 en cada trabajo aceptado.", "Chaque expéditeur est vérifié. Vous bénéficiez de l'assurance livraison FlexaGo et d'une assistance 24h/24 sur chaque mission acceptée.", "Chak moun k ap voye verifye. Ou gen asirans livrezon FlexaGo ak sipò 24/7 sou chak travay ou aksepte.", "每位寄件人都已验证。每个已接受的任务都有 FlexaGo 配送保险和 24/7 在线支持。", "Todo remetente é verificado. Você tem o seguro de entrega da FlexaGo e suporte 24/7 em cada trabalho aceito."],
    "Local & International": ["Local e internacional", "Local et international", "Lokal ak entènasyonal", "本地与国际", "Local e internacional"],
    "Deliver across town or across borders. FlexaGo works for city commutes, road trips, and international flights alike.": ["Entrega en tu ciudad o al otro lado de la frontera. FlexaGo sirve para trayectos urbanos, viajes por carretera y vuelos internacionales.", "Livrez en ville ou à l'étranger. FlexaGo convient aux trajets urbains, aux voyages en voiture et aux vols internationaux.", "Livre nan vil la oswa lòt bò fwontyè. FlexaGo mache pou deplasman nan vil, vwayaj sou wout ak vòl entènasyonal.", "可在城内或跨境配送。FlexaGo 适用于市内通勤、公路旅行和国际航班。", "Entregue na cidade ou além das fronteiras. A FlexaGo funciona para trajetos urbanos, viagens de carro e voos internacionais."],
    "💵 What Travelers Earn": ["💵 Cuánto ganan los viajeros", "💵 Ce que gagnent les voyageurs", "💵 Sa vwayajè yo fè", "💵 旅行者的收入", "💵 Quanto os viajantes ganham"],
    "Local delivery": ["Entrega local", "Livraison locale", "Livrezon lokal", "本地配送", "Entrega local"],
    "Interstate delivery": ["Entrega entre estados", "Livraison inter-États", "Livrezon ant eta", "跨州配送", "Entrega interestadual"],
    "International delivery": ["Entrega internacional", "Livraison internationale", "Livrezon entènasyonal", "国际配送", "Entrega internacional"],
    "Start Earning →": ["Empieza a ganar →", "Commencer à gagner →", "Kòmanse fè lajan →", "开始赚钱 →", "Comece a ganhar →"],
    "How FlexaGo Works": ["Cómo funciona FlexaGo", "Comment fonctionne FlexaGo", "Kijan FlexaGo mache", "FlexaGo 如何运作", "Como a FlexaGo funciona"],
    "1. Sender Creates a Request": ["1. El remitente crea una solicitud", "1. L'expéditeur crée une demande", "1. Moun k ap voye a kreye yon demann", "1. 寄件人创建请求", "1. O remetente cria um pedido"],
    "Describe your item, pickup, and drop-off.": ["Describe tu artículo, la recogida y el destino.", "Décrivez votre article, le retrait et le dépôt.", "Dekri atik ou, kote pou ranmase ak depoze.", "描述您的物品、取件和送达地点。", "Descreva seu item, a coleta e o destino."],
    "2. Traveler Accepts & Delivers": ["2. El viajero acepta y entrega", "2. Le voyageur accepte et livre", "2. Vwayajè a aksepte epi livre", "2. 旅行者接单并配送", "2. O viajante aceita e entrega"],
    "Verified travelers pick up your item and deliver it along their route.": ["Viajeros verificados recogen tu artículo y lo entregan en su ruta.", "Des voyageurs vérifiés récupèrent votre article et le livrent sur leur trajet.", "Vwayajè verifye ranmase atik ou epi livre l sou wout yo.", "已验证的旅行者取走物品，并沿路线送达。", "Viajantes verificados coletam seu item e entregam na rota deles."],
    "3. Delivery Completed": ["3. Entrega completada", "3. Livraison terminée", "3. Livrezon fini", "3. 配送完成", "3. Entrega concluída"],
    "Traveler hands the package to the receiver — simple and secure.": ["El viajero entrega el paquete al destinatario: simple y seguro.", "Le voyageur remet le colis au destinataire, simplement et en toute sécurité.", "Vwayajè a remèt koli a bay moun k ap resevwa a — senp e an sekirite.", "旅行者把包裹交给收件人——简单又安全。", "O viajante entrega o pacote ao destinatário: simples e seguro."],
    "Why FlexaGo?": ["¿Por qué FlexaGo?", "Pourquoi FlexaGo ?", "Poukisa FlexaGo?", "为什么选择 FlexaGo？", "Por que a FlexaGo?"],
    "Verified Travelers": ["Viajeros verificados", "Voyageurs vérifiés", "Vwayajè verifye", "已验证的旅行者", "Viajantes verificados"],
    "Every traveler is identity-verified for safety and trust.": ["Cada viajero tiene su identidad verificada para mayor seguridad y confianza.", "L'identité de chaque voyageur est vérifiée pour la sécurité et la confiance.", "Idantite chak vwayajè verifye pou sekirite ak konfyans.", "每位旅行者都经过身份验证，安全可信。", "A identidade de cada viajante é verificada para sua segurança e confiança."],
    "Track your delivery from pickup to drop-off with live updates.": ["Sigue tu entrega desde la recogida hasta el destino con actualizaciones en vivo.", "Suivez votre livraison du retrait au dépôt avec des mises à jour en direct.", "Swiv livrezon ou depi ranmasaj rive depo ak nouvèl an dirèk.", "通过实时更新，跟踪配送从取件到送达的全过程。", "Acompanhe sua entrega da coleta ao destino com atualizações ao vivo."],
    "Secure Payouts": ["Pagos seguros", "Paiements sécurisés", "Peman an sekirite", "安全收款", "Pagamentos seguros"],
    "Travelers get paid instantly after completing deliveries.": ["Los viajeros reciben su pago al instante tras completar las entregas.", "Les voyageurs sont payés immédiatement après la livraison.", "Vwayajè yo jwenn peman imedyatman apre livrezon.", "旅行者完成配送后立即收款。", "Os viajantes recebem na hora após concluir as entregas."],
    "Global Routes": ["Rutas globales", "Itinéraires mondiaux", "Wout mondyal", "全球路线", "Rotas globais"],
    "Send items across cities, states, or countries using existing travel routes.": ["Envía artículos entre ciudades, estados o países usando rutas de viaje existentes.", "Envoyez des articles entre villes, États ou pays via des trajets existants.", "Voye atik ant vil, eta oswa peyi sou wout vwayaj ki deja egziste.", "利用现有出行路线，在城市、州或国家之间寄送物品。", "Envie itens entre cidades, estados ou países usando rotas de viagem existentes."],
    "Contact Us": ["Contáctanos", "Contactez-nous", "Kontakte nou", "联系我们", "Fale conosco"],
    "Have questions? Need support? We're here to help.": ["¿Tienes preguntas? ¿Necesitas ayuda? Estamos aquí para ayudarte.", "Des questions ? Besoin d'aide ? Nous sommes là pour vous.", "Ou gen kesyon? Ou bezwen sipò? Nou la pou ede ou.", "有疑问？需要支持？我们随时为您服务。", "Tem dúvidas? Precisa de suporte? Estamos aqui para ajudar."],
    "Email:": ["Correo:", "E-mail :", "Imèl:", "邮箱：", "E-mail:"],
    "Ready to Flex Your Route?": ["¿Listo para aprovechar tu ruta?", "Prêt à rentabiliser votre trajet ?", "Pare pou itilize wout ou?", "准备好让路线发挥价值了吗？", "Pronto para aproveitar sua rota?"],
    "Whether you're sending something important or traveling anyway, FlexaGo makes every trip smarter.": ["Ya sea que envíes algo importante o que viajes de todos modos, FlexaGo hace cada viaje más inteligente.", "Que vous envoyiez quelque chose d'important ou que vous voyagiez de toute façon, FlexaGo rend chaque trajet plus malin.", "Kit w ap voye yon bagay enpòtan, kit ou t ap vwayaje kanmenm, FlexaGo fè chak vwayaj pi entelijan.", "无论您要寄送重要物品，还是本来就要出行，FlexaGo 都让每次出行更聪明。", "Seja para enviar algo importante ou porque você já vai viajar, a FlexaGo torna cada viagem mais inteligente."],
    "I Want to Send": ["Quiero enviar", "Je veux envoyer", "Mwen vle voye", "我要寄件", "Quero enviar"],
    "I Want to Travel": ["Quiero viajar", "Je veux voyager", "Mwen vle vwayaje", "我要出行", "Quero viajar"],
    "Detecting location…": ["Detectando ubicación…", "Détection du lieu…", "N ap detekte kote ou ye…", "正在检测位置…", "Detectando localização…"],
    "Privacy": ["Privacidad", "Confidentialité", "Vi prive", "隐私", "Privacidade"],
    "Terms": ["Términos", "Conditions", "Kondisyon", "条款", "Termos"],
    "FlexaGo Assistant · Online": ["Asistente de FlexaGo · En línea", "Assistante FlexaGo · En ligne", "Asistan FlexaGo · Anliy", "FlexaGo 助手 · 在线", "Assistente FlexaGo · Online"],
    "Close": ["Cerrar", "Fermer", "Fèmen", "关闭", "Fechar"],
    "Ask Alice": ["Pregúntale a Alice", "Demander à Alice", "Mande Alice", "询问 Alice", "Pergunte à Alice"],
    "Ask Alice anything…": ["Pregúntale lo que sea a Alice…", "Posez votre question à Alice…", "Mande Alice nenpòt bagay…", "向 Alice 提问…", "Pergunte qualquer coisa à Alice…"],
    "Launching first in Texas": ["Lanzamiento primero en Texas", "Lancement d'abord au Texas", "N ap lanse an premye nan Texas", "首先在德克萨斯州上线", "Lançamento primeiro no Texas"],
    "Not in Texas yet?": ["¿Aún no estás en Texas?", "Pas encore au Texas ?", "Ou poko nan Texas?", "还不在德克萨斯州？", "Ainda não está no Texas?"],
    "Leave your email and we'll tell you when FlexaGo reaches your city.": ["Déjanos tu correo y te avisaremos cuando FlexaGo llegue a tu ciudad.", "Laissez votre e-mail et nous vous préviendrons quand FlexaGo arrivera dans votre ville.", "Kite imèl ou epi n ap fè w konnen lè FlexaGo rive nan vil ou.", "留下您的邮箱，FlexaGo 进入您的城市时我们会通知您。", "Deixe seu e-mail e avisaremos quando a FlexaGo chegar à sua cidade."],
    "Email address": ["Correo electrónico", "Adresse e-mail", "Adrès imèl", "电子邮箱", "Endereço de e-mail"],
    "Your city": ["Tu ciudad", "Votre ville", "Vil ou", "您所在的城市", "Sua cidade"],
    "Join the waitlist": ["Unirme a la lista", "Rejoindre la liste", "Antre nan lis la", "加入候补名单", "Entrar na lista"],
    "You're on the list. We'll email you when FlexaGo reaches your city.": ["Ya estás en la lista. Te escribiremos cuando FlexaGo llegue a tu ciudad.", "Vous êtes sur la liste. Nous vous écrirons quand FlexaGo arrivera dans votre ville.", "Ou nan lis la. N ap ekri w lè FlexaGo rive nan vil ou.", "您已加入名单。FlexaGo 进入您的城市时我们会发邮件通知您。", "Você está na lista. Enviaremos um e-mail quando a FlexaGo chegar à sua cidade."],
    "Please enter a valid email address.": ["Introduce un correo electrónico válido.", "Veuillez saisir une adresse e-mail valide.", "Tanpri antre yon adrès imèl ki valab.", "请输入有效的电子邮箱。", "Digite um e-mail válido."],
    "Couldn't save that. Please try again.": ["No se pudo guardar. Inténtalo de nuevo.", "Enregistrement impossible. Veuillez réessayer.", "Nou pa t ka anrejistre sa. Tanpri eseye ankò.", "保存失败，请重试。", "Não foi possível salvar. Tente novamente."],
    "Too many sign-ups from this connection. Please try again later.": ["Demasiados registros desde esta conexión. Inténtalo más tarde.", "Trop d'inscriptions depuis cette connexion. Réessayez plus tard.", "Twòp enskripsyon sou koneksyon sa a. Eseye ankò pita.", "此网络的注册次数过多，请稍后再试。", "Muitos cadastros desta conexão. Tente mais tarde."],
    "Send a package": ["Enviar un paquete", "Envoyer un colis", "Voye yon koli", "寄送包裹", "Enviar um pacote"],
    "How it works": ["Cómo funciona", "Comment ça marche", "Kijan sa mache", "使用方式", "Como funciona"],
    "Why FlexaGo": ["Por qué FlexaGo", "Pourquoi FlexaGo", "Poukisa FlexaGo", "为什么选择 FlexaGo", "Por que a FlexaGo"],
    "For senders": ["Para remitentes", "Pour les expéditeurs", "Pou moun k ap voye", "寄件人专区", "Para remetentes"],
    "Create a delivery": ["Crear un envío", "Créer une livraison", "Kreye yon livrezon", "创建配送", "Criar uma entrega"],
    "Drive and earn": ["Maneja y gana", "Conduisez et gagnez", "Kondi epi fè lajan", "顺路赚钱", "Dirija e ganhe"],
    "For travelers": ["Para viajeros", "Pour les voyageurs", "Pou vwayajè", "旅行者专区", "Para viajantes"],
    "Become a traveler": ["Hazte viajero", "Devenir voyageur", "Vin yon vwayajè", "成为旅行者", "Seja um viajante"],
    "Log in": ["Iniciar sesión", "Connexion", "Konekte", "登录", "Entrar"],
    "Company": ["Empresa", "Entreprise", "Konpayi", "公司", "Empresa"],
    "Contact": ["Contacto", "Contact", "Kontak", "联系我们", "Contato"],
    "Every member verifies their identity": ["Cada miembro verifica su identidad", "Chaque membre vérifie son identité", "Chak manm verifye idantite yo", "每位会员都验证身份", "Todo membro verifica sua identidade"],
    "Travelers pass a background check": ["Los viajeros pasan una verificación de antecedentes", "Les voyageurs passent une vérification des antécédents", "Vwayajè yo pase yon verifikasyon dosye", "旅行者须通过背景调查", "Os viajantes passam por verificação de antecedentes"],
    "Homepage videos created with Grok": ["Videos de la página principal creados con Grok", "Vidéos de la page d'accueil créées avec Grok", "Videyo paj dakèy la fèt ak Grok", "首页视频由 Grok 生成", "Vídeos da página inicial criados com Grok"],
    "Travelers are paid after delivery is confirmed": ["Los viajeros cobran cuando se confirma la entrega", "Les voyageurs sont payés une fois la livraison confirmée", "Vwayajè yo touche apre livrezon an konfime", "配送确认后旅行者才会收到报酬", "Os viajantes recebem após a entrega ser confirmada"]
  };

  // Curly quotes and non-breaking hyphens vary in the page source.
  const clean = (text) => text.replace(/\s+/g, " ").replace(/[‐‑]/g, "-").replace(/’/g, "'").trim();
  const table = {};
  Object.keys(TEXT).forEach((key) => { table[clean(key)] = TEXT[key]; });

  const originals = new WeakMap();
  const written = new WeakMap();
  const placeholders = new WeakMap();
  let language = "en";

  function translate(text) {
    const row = table[clean(text)];
    return row && COLUMN[language] !== undefined ? row[COLUMN[language]] : text;
  }

  function translateNode(node) {
    if (written.get(node) !== node.nodeValue) originals.set(node, node.nodeValue);

    const next = translate(originals.get(node));

    if (node.nodeValue !== next) node.nodeValue = next;
    written.set(node, next);
  }

  function applyAll() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        return !parent || /^(SCRIPT|STYLE|OPTION)$/.test(parent.tagName) ||
          parent.closest("#alice-messages, #alice-quick-replies")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) translateNode(walker.currentNode);

    document.querySelectorAll("[placeholder]").forEach((element) => {
      if (!placeholders.has(element)) placeholders.set(element, element.placeholder);
      element.placeholder = translate(placeholders.get(element));
    });
  }

  function setLanguage(next) {
    language = NAMES[next] ? next : "en";

    try { localStorage.setItem("preferredLanguage", language); } catch (e) {}

    document.documentElement.lang = language;

    document.querySelectorAll("#languageSelector, #footerLanguage").forEach((selector) => {
      selector.value = language;
    });

    applyAll();
  }

  window.FlexagoSiteI18n = { translate };

  let saved = null;
  try { saved = localStorage.getItem("preferredLanguage"); } catch (e) {}

  const browser = (navigator.language || "en").slice(0, 2);

  setLanguage(saved || (NAMES[browser] ? browser : "en"));

  document.querySelectorAll("#languageSelector, #footerLanguage").forEach((selector) => {
    selector.addEventListener("change", (event) => setLanguage(event.target.value));
  });

  // The Alice button changes its own label when opened and closed.
  const bubbleLabel = document.getElementById("alice-bubble-label");

  if (bubbleLabel) {
    new MutationObserver(() => {
      const next = translate(bubbleLabel.textContent);
      if (bubbleLabel.textContent !== next) bubbleLabel.textContent = next;
    }).observe(bubbleLabel, { childList: true, characterData: true, subtree: true });
  }
})();
