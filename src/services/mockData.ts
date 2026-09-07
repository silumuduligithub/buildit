import { Product, Retailer, RetailerProductOffer } from '../types';

export interface SubCategoryItem {
  id: string;
  name: string;
  itemCount: number;
  imageUrl: string;
  badge?: string;
  description: string;
}

export interface DetailedCategoryItem {
  id: string;
  name: string;
  subcategoriesText: string;
  icon: string;
  imageUrl: string;
  totalProducts: number;
  subcategories: SubCategoryItem[];
}

export const detailedCategories: DetailedCategoryItem[] = [
  {
    id: 'cat_structural',
    name: 'Structural Materials',
    subcategoriesText: 'Cement, TMT Steel, Sand, Bricks, BRC Mesh',
    icon: '🏗️',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=600&auto=format&fit=crop&q=80',
    totalProducts: 54,
    subcategories: [
      {
        id: 'sub_cement',
        name: 'Cement & Concrete',
        itemCount: 16,
        badge: 'Best Seller',
        imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&auto=format&fit=crop&q=80',
        description: 'OPC 53, PPC, Ready-Mix, Waterproof Cement',
      },
      {
        id: 'sub_steel',
        name: 'TMT Steel & Rebars',
        itemCount: 14,
        badge: 'Top Rated',
        imageUrl: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=400&auto=format&fit=crop&q=80',
        description: 'Tata Tiscon 550D, JSW 10/12/16mm, Binding Wire',
      },
      {
        id: 'sub_sand',
        name: 'Sand & Aggregates',
        itemCount: 8,
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80',
        description: 'M-Sand, P-Sand, 20mm Blue Metal, River Sand',
      },
      {
        id: 'sub_bricks',
        name: 'Bricks & AAC Blocks',
        itemCount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&auto=format&fit=crop&q=80',
        description: 'Wirecut Red Bricks, Fly Ash, Lightweight AAC',
      },
      {
        id: 'sub_brc',
        name: 'BRC & Structural Tubes',
        itemCount: 6,
        imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=80',
        description: 'BRC Mesh Sheets, Square Hollow Sections',
      },
    ],
  },
  {
    id: 'cat_finishing',
    name: 'Finishing & Paints',
    subcategoriesText: 'Paints, Wall Putty, Tiles, Waterproofing',
    icon: '🎨',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    totalProducts: 38,
    subcategories: [
      {
        id: 'sub_paints',
        name: 'Exterior & Interior Paints',
        itemCount: 14,
        badge: 'Popular',
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80',
        description: 'Asian Paints Apex, Royale, Enamel, Distemper',
      },
      {
        id: 'sub_putty',
        name: 'Wall Putty & Primers',
        itemCount: 8,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
        description: 'Birla White Care Putty, Damp Proof Primer',
      },
      {
        id: 'sub_tiles',
        name: 'Tiles & Adhesives',
        itemCount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
        description: 'Vitrified Floor Tiles, Tile Fix Adhesives, Grout',
      },
      {
        id: 'sub_waterproofing',
        name: 'Waterproofing Chemicals',
        itemCount: 6,
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80',
        description: 'Dr. Fixit LW+, Damp Block 2K, Terrace Coating',
      },
    ],
  },
  {
    id: 'cat_hardware',
    name: 'Hardware & Tools',
    subcategoriesText: 'Power Tools, Hand Tools, Fasteners, Safety',
    icon: '🔧',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80',
    totalProducts: 42,
    subcategories: [
      {
        id: 'sub_powertools',
        name: 'Power Tools',
        itemCount: 12,
        badge: 'Pro Grade',
        imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400&auto=format&fit=crop&q=80',
        description: 'Bosch Impact Drills, Angle Grinders, Cutters',
      },
      {
        id: 'sub_handtools',
        name: 'Hand & Masonry Tools',
        itemCount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400&auto=format&fit=crop&q=80',
        description: 'Masonry Trowels, Spirit Levels, Measuring Tapes',
      },
      {
        id: 'sub_fasteners',
        name: 'Fasteners & Anchor Bolts',
        itemCount: 9,
        imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400&auto=format&fit=crop&q=80',
        description: 'Wedge Anchors, Concrete Screws, Nails',
      },
      {
        id: 'sub_safety',
        name: 'Site Safety & PPE',
        itemCount: 6,
        imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400&auto=format&fit=crop&q=80',
        description: 'Safety Helmets, High-Vis Vests, Safety Shoes',
      },
    ],
  },
  {
    id: 'cat_electrical',
    name: 'Electrical & Cables',
    subcategoriesText: 'Wires, Switches, MCBs, Conduit Pipes',
    icon: '⚡',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    totalProducts: 36,
    subcategories: [
      {
        id: 'sub_wires',
        name: 'Wires & Flexible Cables',
        itemCount: 12,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
        description: 'Havells 2.5/4.0 sq mm, Polycab FR Copper',
      },
      {
        id: 'sub_switches',
        name: 'Switches & DB Boxes',
        itemCount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
        description: 'Schneider Modular Switches, MCB Isolators',
      },
      {
        id: 'sub_conduit',
        name: 'PVC Conduits & Fittings',
        itemCount: 8,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
        description: 'Heavy Gauge Conduits, Junction Boxes, Bends',
      },
      {
        id: 'sub_lighting',
        name: 'Site Flood & LED Lights',
        itemCount: 6,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
        description: '50W/100W Waterproof LED Floodlights',
      },
    ],
  },
  {
    id: 'cat_plumbing',
    name: 'Plumbing & Tanks',
    subcategoriesText: 'CPVC Pipes, Overhead Tanks, Pumps, Valves',
    icon: '🚿',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
    totalProducts: 30,
    subcategories: [
      {
        id: 'sub_pipes',
        name: 'CPVC & UPVC Pipes',
        itemCount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
        description: 'Finolex SDR 11 CPVC, Heavy Drain Pipes',
      },
      {
        id: 'sub_tanks',
        name: 'Water Storage Tanks',
        itemCount: 6,
        imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
        description: 'Sintex 1000L / 500L Triple Layer Overhead Tanks',
      },
      {
        id: 'sub_pumps',
        name: 'Water Pumps & Motors',
        itemCount: 6,
        imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
        description: '1HP Submersible, Monoblock Pressure Pumps',
      },
      {
        id: 'sub_fittings',
        name: 'Valves & Brass Fittings',
        itemCount: 8,
        imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
        description: 'Brass Ball Valves, Flanges, Unions, Bib Taps',
      },
    ],
  },
];

export const buildKartCategories = detailedCategories.map((c) => ({
  id: c.id,
  name: c.name,
  subcategories: c.subcategoriesText,
  icon: c.icon,
}));

export const mockProducts: Product[] = [
  {
    id: 'p_cement_1',
    name: 'UltraTech Cement OPC 53 Grade',
    brand: 'UltraTech',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    description: 'OPC 53 Grade High-Strength Cement. Ideal for heavy load RCC, high-rise buildings, bridges and plastering.',
  },
  {
    name: 'Ambuja Plus Roof Special Cement',
    id: 'p_cement_5',
    brand: 'Ambuja',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    description: 'Specially engineered high-density cement for slab casting, roof protection and 100% leak-proof concrete.',
  },
  {
    id: 'p_cement_2',
    name: 'Ramco Supercrete Cement',
    brand: 'Ramco',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    imageUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80',
    description: 'High performance blended cement specially designed for high strength concrete and faster curing.',
  },
  {
    id: 'p_cement_3',
    name: 'ACC Gold Water Shield Cement',
    brand: 'ACC Cement',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    description: 'Water-repellent premium cement with micro-fillers for complete home damp-proofing and durability.',
  },
  {
    id: 'p_cement_4',
    name: 'Ambuja Kawach Waterproof Cement',
    brand: 'Ambuja',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    description: 'Specially formulated water-repelling cement to protect structures from saline and moisture attack.',
  },
  {
    id: 'p_steel_1',
    name: 'Tata Tiscon 550D TMT Steel Bar 12mm',
    brand: 'Tata Tiscon',
    category: 'Structural Materials',
    unit: '12m Piece',
    imageUrl: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80',
    description: 'Fe 550D Super Ductile TMT Rebar with high seismic resistance and superior weldability.',
  },
  {
    id: 'p_steel_2',
    name: 'JSW Neosteel Fe 550D TMT Bar 10mm',
    brand: 'JSW Steel',
    category: 'Structural Materials',
    unit: '12m Piece',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
    description: 'High yield strength thermo-mechanically treated bar with excellent rib pattern for concrete grip.',
  },
  {
    id: 'p_sand_1',
    name: 'M-Sand (Manufactured Sand for Concrete)',
    brand: 'Robo Silicon',
    category: 'Structural Materials',
    unit: '1 Tonne / 1000 Kg',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    description: 'Double washed, zero silt manufactured sand with cubical shape for maximum concrete strength.',
  },
  {
    id: 'p_bricks_1',
    name: 'Premium Wirecut Red Clay Bricks',
    brand: 'Standard Brick Co.',
    category: 'Structural Materials',
    unit: 'Pack of 500 Pcs',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    description: 'High compressive strength kiln-burnt red clay bricks with smooth edges and uniform dimensions.',
  },
  {
    id: 'p_paint_1',
    name: 'Asian Paints Apex Ultima Exterior Emulsion',
    brand: 'Asian Paints',
    category: 'Finishing',
    unit: '20 Litre Bucket',
    imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
    description: 'Advanced anti-algal, dust-resistant exterior emulsion with 7-year performance warranty.',
  },
  {
    id: 'p_plumbing_1',
    name: 'Finolex CPVC Pipe 1 Inch SDR 11',
    brand: 'Finolex',
    category: 'Plumbing',
    unit: '3 Metre Length',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy duty hot and cold water potable piping system conforming to IS:15778.',
  },
  {
    id: 'p_electrical_1',
    name: 'Havells LifeLine Plus 2.5 sq mm Flame Retardant Wire',
    brand: 'Havells',
    category: 'Electrical',
    unit: '90 Metre Coil',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    description: '100% pure electrolytic grade copper wire with HRFR insulation and oxygen index certification.',
  },
  {
    id: 'p_hardware_1',
    name: 'Bosch GSB 500W Impact Drill Kit (100 Accessories)',
    brand: 'Bosch',
    category: 'Hardware',
    unit: '1 Full Kit',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    description: 'Versatile impact drill with reversing brush system and heavy duty masonry accessories.',
  },
];

export interface StoreComparison {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  reviewCount: string;
  deliveryTime: string;
  price: number;
  stock: number;
  isAuthorized: boolean;
}

export const mockStores: Retailer[] = [
  {
    id: 's_sri_sai',
    name: 'Sri Sai Hardware & Builders',
    address: 'Plot No. 12, Main Road, Kondapur, Hyderabad, TS',
    distance: 1.5,
    rating: 4.8,
    isServiceable: true,
    deliveryTypes: ['express', 'scheduled'],
    phone: '+91 98765 11223',
  },
  {
    id: 's_balaji',
    name: 'Balaji Cement & Steel Depot',
    address: 'Near RTO Office, Hitec City, Hyderabad, TS',
    distance: 1.8,
    rating: 4.4,
    isServiceable: true,
    deliveryTypes: ['express', 'scheduled', 'bulk'],
    phone: '+91 98765 22334',
  },
  {
    id: 's_venkateshwara',
    name: 'Venkateshwara Traders',
    address: 'KPHB Colony, 4th Phase, Hyderabad, TS',
    distance: 2.1,
    rating: 4.5,
    isServiceable: true,
    deliveryTypes: ['express', 'scheduled'],
    phone: '+91 98765 33445',
  },
  {
    id: 's_om_sai',
    name: 'Om Sai Builders Supply',
    address: 'Miyapur Main Road, Hyderabad, TS',
    distance: 2.3,
    rating: 4.3,
    isServiceable: true,
    deliveryTypes: ['express', 'bulk'],
    phone: '+91 98765 44556',
  },
  {
    id: 's_nandini',
    name: 'Nandini Hardware & Paints',
    address: 'Gachibowli Ring Road, Hyderabad, TS',
    distance: 2.6,
    rating: 4.2,
    isServiceable: true,
    deliveryTypes: ['scheduled'],
    phone: '+91 98765 55667',
  },
];

export const mockOffers: RetailerProductOffer[] = [
  // UltraTech Cement
  { id: 'o_utc_1', productId: 'p_cement_1', retailerId: 's_sri_sai', price: 410, stock: 450, isAvailable: true, estimatedDeliveryMins: 25 },
  { id: 'o_utc_2', productId: 'p_cement_1', retailerId: 's_balaji', price: 415, stock: 320, isAvailable: true, estimatedDeliveryMins: 30 },
  { id: 'o_utc_3', productId: 'p_cement_1', retailerId: 's_venkateshwara', price: 418, stock: 200, isAvailable: true, estimatedDeliveryMins: 35 },
  { id: 'o_utc_4', productId: 'p_cement_1', retailerId: 's_om_sai', price: 420, stock: 600, isAvailable: true, estimatedDeliveryMins: 40 },
  { id: 'o_utc_5', productId: 'p_cement_1', retailerId: 's_nandini', price: 422, stock: 150, isAvailable: true, estimatedDeliveryMins: 45 },

  // Ramco Cement
  { id: 'o_ramco_1', productId: 'p_cement_2', retailerId: 's_sri_sai', price: 395, stock: 300, isAvailable: true, estimatedDeliveryMins: 25 },
  { id: 'o_ramco_2', productId: 'p_cement_2', retailerId: 's_balaji', price: 398, stock: 180, isAvailable: true, estimatedDeliveryMins: 30 },

  // ACC Cement
  { id: 'o_acc_1', productId: 'p_cement_3', retailerId: 's_balaji', price: 405, stock: 250, isAvailable: true, estimatedDeliveryMins: 30 },
  { id: 'o_acc_2', productId: 'p_cement_3', retailerId: 's_sri_sai', price: 408, stock: 140, isAvailable: true, estimatedDeliveryMins: 25 },

  // Ambuja Cement
  { id: 'o_amb_1', productId: 'p_cement_4', retailerId: 's_venkateshwara', price: 400, stock: 400, isAvailable: true, estimatedDeliveryMins: 35 },

  // Tata Tiscon Steel
  { id: 'o_steel_1', productId: 'p_steel_1', retailerId: 's_balaji', price: 680, stock: 200, isAvailable: true, estimatedDeliveryMins: 30 },
  { id: 'o_steel_2', productId: 'p_steel_1', retailerId: 's_sri_sai', price: 690, stock: 150, isAvailable: true, estimatedDeliveryMins: 25 },

  // JSW Steel
  { id: 'o_jsw_1', productId: 'p_steel_2', retailerId: 's_om_sai', price: 540, stock: 350, isAvailable: true, estimatedDeliveryMins: 40 },

  // M-Sand
  { id: 'o_sand_1', productId: 'p_sand_1', retailerId: 's_om_sai', price: 1650, stock: 50, isAvailable: true, estimatedDeliveryMins: 45 },

  // Red Bricks
  { id: 'o_brick_1', productId: 'p_bricks_1', retailerId: 's_sri_sai', price: 4500, stock: 80, isAvailable: true, estimatedDeliveryMins: 35 },

  // Asian Paints
  { id: 'o_paint_1', productId: 'p_paint_1', retailerId: 's_nandini', price: 5450, stock: 40, isAvailable: true, estimatedDeliveryMins: 40 },

  // Finolex Pipe (Out of Stock for Demo)
  { id: 'o_pipe_1', productId: 'p_plumbing_1', retailerId: 's_sri_sai', price: 340, stock: 0, isAvailable: false, estimatedDeliveryMins: 25 },

  // Havells Wire
  { id: 'o_wire_1', productId: 'p_electrical_1', retailerId: 's_sri_sai', price: 2350, stock: 50, isAvailable: true, estimatedDeliveryMins: 25 },

  // Bosch Drill
  { id: 'o_drill_1', productId: 'p_hardware_1', retailerId: 's_sri_sai', price: 3499, stock: 25, isAvailable: true, estimatedDeliveryMins: 25 },
];

export const mockCoupons = [
  {
    code: 'FLAT10',
    title: 'Flat 10% OFF on orders above ₹3000',
    sub: 'Max discount ₹300 • T&C Apply',
    validity: 'Valid till 15 Jun 2026',
    discountPercent: 10,
    maxDiscount: 300,
    minOrder: 3000,
  },
  {
    code: 'BUILDKART50',
    title: '₹50 OFF on orders above ₹999',
    sub: 'Flat instant discount on all categories',
    validity: 'Valid till 28 Jun 2026',
    discountAmount: 50,
    minOrder: 999,
  },
  {
    code: 'FREESHIP',
    title: 'FREE Delivery on all orders',
    sub: 'No minimum order value',
    validity: 'Valid till 31 May 2026',
    freeDelivery: true,
  },
];

export const mockSavedAddresses = [
  {
    id: 'addr_1',
    label: 'Home',
    tag: 'Home',
    address: 'Kondapur, Hyderabad, TS',
    details: 'Plot No. 45, Street 2, Near RTO Office, Kondapur, Hyderabad, 500084',
    recipientName: 'Ravi Kumar',
    phone: '9876543210',
    deliveryTime: '25-30 min',
    isFreeDelivery: true,
  },
  {
    id: 'addr_2',
    label: 'Site',
    tag: 'Site',
    address: 'Miyapur, Hyderabad, TS',
    details: 'H No. 8-3-110/4, Beside Metro Pillar 825, Miyapur, Hyderabad, 500049',
    recipientName: 'Ravi Kumar',
    phone: '9876543210',
    deliveryTime: '35-40 min',
    isFreeDelivery: true,
  },
];

export const categoryData = buildKartCategories;
export const mockRetailers = mockStores;
