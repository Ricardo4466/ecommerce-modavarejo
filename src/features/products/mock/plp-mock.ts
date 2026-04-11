import type { Product } from '@/types'

/** Fotos reais de moda (Unsplash). 400 = cards PLP; 960 = galeria PDP */
function fashionPhoto(id: string, size: 400 | 960): string {
  return `https://images.unsplash.com/photo-${id}?fm=jpg&q=80&w=${size}&h=${size}&auto=format&fit=crop&ixlib=rb-4.0.3`
}

function galleryThree(a: string, b: string, c: string): string[] {
  return [fashionPhoto(a, 960), fashionPhoto(b, 960), fashionPhoto(c, 960)]
}

export const PLP_MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'camiseta-basica-algodao-m',
    name: 'Camiseta básica algodão orgânico',
    description:
      'Modelagem regular, gola careca e toque macio. Ideal para o dia a dia com calça jeans ou bermuda.',
    longDescription:
      'Peça essencial do guarda-roupa com modelagem regular e acabamento reforçado nas mangas. O algodão orgânico oferece respirabilidade e toque macio em qualquer estação. Combine com calça jeans para um visual casual ou com alfaiataria leve para ambientes de trabalho com dress code flexível. Lavagem à máquina em ciclo delicado; secar à sombra para preservar a cor.',
    compareAtPriceCents: 99_900,
    priceCents: 79_900,
    category: 'masculino',
    condition: 'novo',
    brand: 'Linha do Sul',
    brandSlug: 'linha-do-sul',
    imageUrl: fashionPhoto('1521572163474-6864f9cf17ab', 400),
    galleryUrls: galleryThree(
      '1521572163474-6864f9cf17ab',
      '1583743814966-8936f5b7be1a',
      '1618354691373-d851c5c3a990',
    ),
    stock: 24,
    rating: 4.7,
    reviewCount: 186,
    specifications: [
      { label: 'Tamanho', value: 'M — tabela P/M/G disponível na PDP' },
      { label: 'Composição', value: '100% algodão orgânico' },
      { label: 'Categoria', value: 'Camisetas · Masculino' },
      { label: 'Cores', value: 'Off-white, preto, verde musgo' },
    ],
  },
  {
    id: '2',
    slug: 'calca-chino-slim-42',
    name: 'Calça chino slim',
    description:
      'Corte slim discreto, bolsos laterais e passadores largos. Peça usada com sinais leves de uso.',
    longDescription:
      'Chino com caimento slim que valoriza a silhueta sem apertar demais. Bolsos frontais e traseiros funcionais, passadores compatíveis com cintos até 4 cm. Indicada para composições smart casual. Peça de segunda mão: pequenas marcas de uso nas costuras são esperadas e descritas com transparência.',
    compareAtPriceCents: 189_900,
    priceCents: 149_900,
    category: 'masculino',
    condition: 'usado',
    brand: 'Cassis',
    brandSlug: 'cassis',
    imageUrl: fashionPhoto('1584865288642-42078afe6942', 400),
    galleryUrls: galleryThree(
      '1584865288642-42078afe6942',
      '1766818436713-dbf4f078908a',
      '1542272604-787c3838835d',
    ),
    stock: 3,
    rating: 4.2,
    reviewCount: 41,
    specifications: [
      { label: 'Tamanho', value: '42 (cintura) · comprimento interno 82 cm' },
      { label: 'Material', value: '97% algodão, 3% elastano' },
      { label: 'Categoria', value: 'Calças · Masculino' },
      { label: 'Estado', value: 'Sem rasgos; lavagens visíveis nas costuras' },
    ],
  },
  {
    id: '3',
    slug: 'jaqueta-jeans-oversized-g',
    name: 'Jaqueta jeans oversized',
    description:
      'Modelagem ampla, lavagem média e metais em bronze. Quase nova — usada poucas vezes.',
    priceCents: 259_900,
    category: 'masculino',
    condition: 'excelente',
    brand: 'Maré Alta',
    brandSlug: 'mare-alta',
    imageUrl: fashionPhoto('1611312449408-fcece27cdbb7', 400),
    galleryUrls: galleryThree(
      '1611312449408-fcece27cdbb7',
      '1543076447-215ad9ba6923',
      '1527016021513-b09758b777bd',
    ),
    stock: 8,
    rating: 4.8,
    reviewCount: 52,
    specifications: [
      { label: 'Tamanho', value: 'G — ombros 48 cm' },
      { label: 'Composição', value: '100% algodão denim' },
      { label: 'Categoria', value: 'Jaquetas · Masculino' },
      { label: 'Detalhes', value: 'Bolsos duplos no peito, punhos com botão' },
    ],
  },
  {
    id: '4',
    slug: 'vestido-midi-floral-p',
    name: 'Vestido midi floral',
    description:
      'Decote V e cintura marcada com amarração lateral. Tecido leve para eventos e brunch.',
    longDescription:
      'Vestido midi com estampa floral em tons suaves, forro interno para conforto e opacidade. O decote em V alonga o pescoço e a amarração lateral permite ajuste fino na cintura. Comprimento abaixo do joelho — ideal para eventos diurnos, jantares e ocasiões semi-formais. Fechamento posterior com zíper invisível.',
    compareAtPriceCents: 279_900,
    priceCents: 219_900,
    category: 'feminino',
    condition: 'novo',
    brand: 'Ateliê Bruma',
    brandSlug: 'atelie-bruma',
    imageUrl: fashionPhoto('1623609163859-ca93c959b98a', 400),
    galleryUrls: galleryThree(
      '1623609163859-ca93c959b98a',
      '1595777457583-95e059d581b8',
      '1539008835657-9e8e9680c956',
    ),
    stock: 14,
    rating: 4.9,
    reviewCount: 203,
    specifications: [
      { label: 'Tamanho', value: 'P · comprimento midi (abaixo do joelho)' },
      { label: 'Material', value: 'Viscose estampada, forro 100% poliéster' },
      { label: 'Categoria', value: 'Vestidos · Feminino' },
      { label: 'Cuidados', value: 'Lavagem a mão recomendada' },
    ],
  },
  {
    id: '5',
    slug: 'blusa-crepe-manga-longa-m',
    name: 'Blusa crepe manga longa',
    description:
      'Caimento fluido e punho com botão de madrepérola. Excelente estado, sem manchas.',
    priceCents: 129_900,
    category: 'feminino',
    condition: 'excelente',
    brand: 'Linha do Sul',
    brandSlug: 'linha-do-sul',
    imageUrl: fashionPhoto('1584030373081-f37b7bb4fa8e', 400),
    galleryUrls: galleryThree(
      '1584030373081-f37b7bb4fa8e',
      '1564257631407-4deb1f99d992',
      '1608234807905-4466023792f5',
    ),
    stock: 11,
    rating: 4.5,
    reviewCount: 67,
    specifications: [
      { label: 'Tamanho', value: 'M' },
      { label: 'Composição', value: '100% poliéster crepe' },
      { label: 'Categoria', value: 'Blusas · Feminino' },
    ],
  },
  {
    id: '6',
    slug: 'saia-plissada-midi-g',
    name: 'Saia plissada midi',
    description: 'Plissado permanente e cós com elástico embutido. Segunda mão em bom estado.',
    priceCents: 99_900,
    category: 'feminino',
    condition: 'usado',
    brand: 'Cassis',
    brandSlug: 'cassis',
    imageUrl: fashionPhoto('1583496661160-fb5886a0aaaa', 400),
    galleryUrls: galleryThree(
      '1583496661160-fb5886a0aaaa',
      '1577900232427-18219b9166a0',
      '1509182469511-7f0b50bfa63e',
    ),
    stock: 5,
    rating: 4.1,
    reviewCount: 28,
    specifications: [
      { label: 'Tamanho', value: 'G · cintura 86–90 cm' },
      { label: 'Material', value: 'Poliéster reciclado' },
      { label: 'Categoria', value: 'Saias · Feminino' },
    ],
  },
  {
    id: '7',
    slug: 'tenis-casual-couro-42',
    name: 'Tênis casual couro',
    description:
      'Solado em borracha e palmilha acolchoada. Par novo na caixa — sola sem desgaste.',
    priceCents: 319_900,
    category: 'masculino',
    condition: 'novo',
    brand: 'Pôr do Sol',
    brandSlug: 'por-do-sol',
    imageUrl: fashionPhoto('1542291026-7eec264c27ff', 400),
    galleryUrls: galleryThree(
      '1542291026-7eec264c27ff',
      '1595950653106-6c9ebd614d3a',
      '1560769629-975ec94e6a86',
    ),
    stock: 9,
    rating: 4.6,
    reviewCount: 144,
    specifications: [
      { label: 'Tamanho', value: 'BR 42 / EU 41' },
      { label: 'Material', value: 'Couro bovino, forro em têxtil' },
      { label: 'Categoria', value: 'Calçados · Masculino' },
    ],
  },
  {
    id: '8',
    slug: 'bolsa-tote-couro-caramelo',
    name: 'Bolsa tote couro caramelo',
    description:
      'Alças reforçadas e divisão interna com zíper. Pouco uso, couro com pátina uniforme.',
    longDescription:
      'Tote em couro legítimo na tonalidade caramelo, com alças duplas reforçadas para uso diário. Interior com bolso com zíper e divisórias para organização. Pátina natural do couro confere caráter único à peça. Dimensões generosas para notebook de até 13", agenda e itens pessoais. Estado excelente: ferragens sem oxidação visível.',
    compareAtPriceCents: 449_900,
    priceCents: 389_900,
    category: 'acessorios',
    condition: 'excelente',
    brand: 'Maré Alta',
    brandSlug: 'mare-alta',
    imageUrl: fashionPhoto('1598532163257-ae3c6b2524b6', 400),
    galleryUrls: galleryThree(
      '1598532163257-ae3c6b2524b6',
      '1584917865442-de89df76afd3',
      '1614179689702-355944cd0918',
    ),
    stock: 4,
    rating: 4.9,
    reviewCount: 91,
    specifications: [
      { label: 'Tamanho', value: '32 × 28 × 12 cm' },
      { label: 'Material', value: 'Couro legítimo, ferragens nacaradas' },
      { label: 'Categoria', value: 'Bolsas · Acessórios' },
    ],
  },
  {
    id: '9',
    slug: 'cinto-couro-fivela-95',
    name: 'Cinto couro fivela metal',
    description:
      'Largura 3,5 cm e fivela em metal escovado. Produto novo com etiqueta.',
    priceCents: 89_900,
    category: 'acessorios',
    condition: 'novo',
    brand: 'Ferradura',
    brandSlug: 'ferradura',
    imageUrl: fashionPhoto('1624222247344-550fb60583dc', 400),
    galleryUrls: galleryThree(
      '1624222247344-550fb60583dc',
      '1611937685025-8d1df67a80b6',
      '1705493655920-20c572928501',
    ),
    stock: 42,
    rating: 4.4,
    reviewCount: 312,
    specifications: [
      { label: 'Tamanho', value: '95 cm (furos 85–100 cm)' },
      { label: 'Material', value: 'Couro curtido vegetalmente' },
      { label: 'Categoria', value: 'Cintos · Acessórios' },
    ],
  },
  {
    id: '10',
    slug: 'lenco-seda-estampado',
    name: 'Lenço de seda estampado',
    description:
      'Estampa geométrica em tons terrosos. Peça usada com bainha levemente desbotada.',
    priceCents: 59_900,
    category: 'acessorios',
    condition: 'usado',
    brand: 'Ateliê Bruma',
    brandSlug: 'atelie-bruma',
    imageUrl: fashionPhoto('1457545195570-67f207084966', 400),
    galleryUrls: galleryThree(
      '1457545195570-67f207084966',
      '1643312892626-80632ef6d7dc',
      '1609362065704-0e1da86d582a',
    ),
    stock: 6,
    rating: 4.0,
    reviewCount: 19,
    specifications: [
      { label: 'Tamanho', value: '70 × 70 cm' },
      { label: 'Material', value: '100% seda' },
      { label: 'Categoria', value: 'Lenços · Acessórios' },
    ],
  },
  {
    id: '11',
    slug: 'cardigan-tricot-g',
    name: 'Cardigan tricot canelado',
    description:
      'Botões de madrepérola e mangas longas. Novo na coleção outono — fibra macia ao toque.',
    priceCents: 189_900,
    category: 'feminino',
    condition: 'novo',
    brand: 'Pôr do Sol',
    brandSlug: 'por-do-sol',
    imageUrl: fashionPhoto('1610288311735-39b7facbd095', 400),
    galleryUrls: galleryThree(
      '1610288311735-39b7facbd095',
      '1579206464424-7e43a81cadc1',
      '1552875387-814ba27aeafd',
    ),
    stock: 17,
    rating: 4.7,
    reviewCount: 88,
    specifications: [
      { label: 'Tamanho', value: 'G · manga 62 cm' },
      { label: 'Composição', value: '52% algodão, 30% poliamida, 18% lã merino' },
      { label: 'Categoria', value: 'Cardigans · Feminino' },
    ],
  },
  {
    id: '12',
    slug: 'bermuda-linho-m',
    name: 'Bermuda linho misto',
    description:
      'Cós com cordão e bolsos embutidos. Segunda mão com ótimo caimento após lavagens.',
    priceCents: 109_900,
    category: 'masculino',
    condition: 'usado',
    brand: 'Linha do Sul',
    brandSlug: 'linha-do-sul',
    imageUrl: fashionPhoto('1612913334025-bedf136f8715', 400),
    galleryUrls: galleryThree(
      '1612913334025-bedf136f8715',
      '1591195853828-11db59a44f6b',
      '1617951907145-53f6eb87a3a3',
    ),
    stock: 7,
    rating: 4.3,
    reviewCount: 54,
    specifications: [
      { label: 'Tamanho', value: 'M · comprimento 48 cm' },
      { label: 'Material', value: '55% linho, 45% algodão' },
      { label: 'Categoria', value: 'Bermudas · Masculino' },
    ],
  },
]

const brandMap = new Map<string, string>()
for (const p of PLP_MOCK_PRODUCTS) {
  brandMap.set(p.brandSlug, p.brand)
}

/** Opções do filtro de marca (derivadas do mock) */
export const PLP_BRAND_OPTIONS = [
  { value: '', label: 'Todas as marcas' },
  ...[...brandMap.entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
    .map(([value, label]) => ({ value, label })),
]
