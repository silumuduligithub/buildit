import { Product, Retailer, RetailerProductOffer } from '../types';

export interface CategoryItem {
  id: string;
  name: string;
  subcategories: string;
  icon: string;
}

export const buildKartCategories: CategoryItem[] = [
  {
    id: 'cat_structural',
    name: 'Structural Materials',
    subcategories: 'Cement, Steel, Sand, Bricks...',
    icon: '🏗️',
  },
  {
    id: 'cat_electrical',
    name: 'Electrical',
    subcategories: 'Wires, Switches, MCBs, Pipes...',
    icon: '⚡',
  },
  {
    id: 'cat_plumbing',
    name: 'Plumbing',
    subcategories: 'Pipes, Fittings, Tanks, Taps...',
    icon: '🚿',
  },
  {
    id: 'cat_finishing',
    name: 'Finishing',
    subcategories: 'Paints, Tiles, Sanitaryware...',
    icon: '🎨',
  },
  {
    id: 'cat_hardware',
    name: 'Hardware',
    subcategories: 'Tools, Fasteners, Safety, Locks...',
    icon: '🔩',
  },
  {
    id: 'cat_doors',
    name: 'Doors & Windows',
    subcategories: 'Doors, Windows, Accessories...',
    icon: '🚪',
  },
  {
    id: 'cat_home',
    name: 'Home Improvement',
    subcategories: 'Lights, Adhesives, Others...',
    icon: '🏡',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p_cement_1',
    name: 'UltraTech Cement OPC 53 Grade',
    brand: 'UltraTech',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    description: 'OPC 53 Grade High-Strength Cement. Ideal for heavy load RCC, high-rise buildings, bridges and plastering.',
  },
  {
    id: 'p_cement_2',
    name: 'Ramco Supercrete Cement',
    brand: 'Ramco',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    description: 'High performance blended cement specially designed for high strength concrete and faster curing.',
  },
  {
    id: 'p_cement_3',
    name: 'ACC Gold Water Shield Cement',
    brand: 'ACC Cement',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    description: 'Water-repellent premium cement with micro-fillers for complete home damp-proofing and durability.',
  },
  {
    id: 'p_cement_4',
    name: 'Ambuja Kawach Waterproof Cement',
    brand: 'Ambuja',
    category: 'Structural Materials',
    unit: '50 Kg Bag',
    description: 'Specially formulated water-repelling cement to protect structures from saline and moisture attack.',
  },
  {
    id: 'p_steel_1',
    name: 'Tata Tiscon 550D TMT Steel Bar 12mm',
    brand: 'Tata Tiscon',
    category: 'Structural Materials',
    unit: '12m Piece',
    description: 'Fe 550D Super Ductile TMT Rebar with high seismic resistance and superior weldability.',
  },
  {
    id: 'p_steel_2',
    name: 'JSW Neosteel Fe 550D TMT Bar 10mm',
    brand: 'JSW Steel',
    category: 'Structural Materials',
    unit: '12m Piece',
    description: 'High yield strength thermo-mechanically treated bar with excellent rib pattern for concrete grip.',
  },
  {
    id: 'p_sand_1',
    name: 'M-Sand (Manufactured Sand for Concrete)',
    brand: 'Robo Silicon',
    category: 'Structural Materials',
    unit: '1 Tonne / 1000 Kg',
    description: 'Double washed, zero silt manufactured sand with cubical shape for maximum concrete strength.',
  },
  {
    id: 'p_bricks_1',
    name: 'Premium Wirecut Red Clay Bricks',
    brand: 'Standard Brick Co.',
    category: 'Structural Materials',
    unit: 'Pack of 500 Pcs',
    description: 'High compressive strength kiln-burnt red clay bricks with smooth edges and uniform dimensions.',
  },
  {
    id: 'p_paint_1',
    name: 'Asian Paints Apex Ultima Exterior Emulsion',
    brand: 'Asian Paints',
    category: 'Finishing',
    unit: '20 Litre Bucket',
    description: 'Advanced anti-algal, dust-resistant exterior emulsion with 7-year performance warranty.',
  },
  {
    id: 'p_plumbing_1',
    name: 'Finolex CPVC Pipe 1 Inch SDR 11',
    brand: 'Finolex',
    category: 'Plumbing',
    unit: '3 Metre Length',
    description: 'Heavy duty hot and cold water potable piping system conforming to IS:15778.',
  },
  {
    id: 'p_electrical_1',
    name: 'Havells LifeLine Plus 2.5 sq mm Flame Retardant Wire',
    brand: 'Havells',
    category: 'Electrical',
    unit: '90 Metre Coil',
    description: '100% pure electrolytic grade copper wire with HRFR insulation and oxygen index certification.',
  },
  {
    id: 'p_hardware_1',
    name: 'Bosch GSB 500W Impact Drill Kit (100 Accessories)',
    brand: 'Bosch',
    category: 'Hardware',
    unit: '1 Full Kit',
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
