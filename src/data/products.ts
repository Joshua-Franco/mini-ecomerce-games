export interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number
  badge: string
  icon: string
  specs: string
  image: string
}

export const products: Product[] = [
  {
    id: 101,
    name: 'ROG Strix RTX 4090 OC Edition 24GB',
    category: 'gpu',
    price: 8499,
    oldPrice: 9299,
    badge: 'Oferta Flash',
    icon: 'fa-microchip',
    specs: '24GB GDDR6X | Ray Tracing | DLSS 3.5',
    image: '/images/product-101.jpg',
  },
  {
    id: 102,
    name: 'Laptop Gamer ASUS ROG Strix G16 16" 240Hz',
    category: 'laptop',
    price: 7499,
    oldPrice: 8199,
    badge: '-S/ 700 OFF',
    icon: 'fa-laptop',
    specs: 'Intel i9-14900HX | RTX 4070 8GB | 32GB RAM | 1TB SSD',
    image: '/images/product-102.jpg',
  },
  {
    id: 103,
    name: 'Procesador AMD Ryzen 7 7800X3D (AM5)',
    category: 'cpu',
    price: 1649,
    oldPrice: 1849,
    badge: 'Top Ventas',
    icon: 'fa-microchip',
    specs: '8 Núcleos | 16 Hilos | 3D V-Cache',
    image: '/images/product-103.jpg',
  },
  {
    id: 104,
    name: 'Monitor Curved OLED 34" Samsung Odyssey G8 175Hz',
    category: 'monitor',
    price: 3899,
    oldPrice: 4299,
    badge: 'OLED QHD',
    icon: 'fa-desktop',
    specs: '0.03ms Respuesta | HDR True Black 400',
    image: '/images/product-104.jpg',
  },
  {
    id: 105,
    name: 'Laptop Lenovo Legion Pro 5 16" WQXGA',
    category: 'laptop',
    price: 5699,
    oldPrice: 6199,
    badge: 'Popular',
    icon: 'fa-laptop',
    specs: 'Ryzen 7 7745HX | RTX 4060 8GB | 16GB RAM',
    image: '/images/product-105.jpg',
  },
  {
    id: 106,
    name: 'Procesador Intel Core i9-14900K 24-Cores',
    category: 'cpu',
    price: 2299,
    oldPrice: 2499,
    badge: 'LGA1700',
    icon: 'fa-microchip',
    specs: 'Hasta 6.0 GHz Turbo | 32 Hilos',
    image: '/images/product-106.jpg',
  },
  {
    id: 107,
    name: 'SSD M.2 NVMe Samsung 990 PRO 2TB PCIe 4.0',
    category: 'storage',
    price: 599,
    oldPrice: 689,
    badge: '7450 MB/s',
    icon: 'fa-hard-drive',
    specs: 'Lectura Ultra Rápida | Compatible con PS5 y PC',
    image: '/images/product-107.jpg',
  },
  {
    id: 108,
    name: 'Teclado Mecánico Custom Wireless RGB Red Switches',
    category: 'peripherals',
    price: 349,
    oldPrice: 399,
    badge: 'Hot-Swap',
    icon: 'fa-keyboard',
    specs: 'Bluetooth / 2.4Ghz | Batería 4000mAh',
    image: '/images/product-108.jpg',
  },
]
