export interface PcPart {
  label: string
  options: { name: string; price: number }[]
}

export const pcParts: PcPart[] = [
  {
    label: 'Procesador (CPU)',
    options: [
      { name: 'AMD Ryzen 7 7800X3D (AM5)', price: 1649 },
      { name: 'Intel Core i9-14900K', price: 2299 },
      { name: 'AMD Ryzen 5 7600X', price: 989 },
    ],
  },
  {
    label: 'Tarjeta de Video (GPU)',
    options: [
      { name: 'NVIDIA RTX 4090 OC 24GB', price: 8499 },
      { name: 'NVIDIA RTX 4080 Super 16GB', price: 4899 },
      { name: 'NVIDIA RTX 4070 Super 12GB', price: 2999 },
    ],
  },
  {
    label: 'Memoria RAM',
    options: [
      { name: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz', price: 549 },
      { name: 'G.Skill Trident Z5 DDR5 64GB 6000MHz', price: 999 },
    ],
  },
  {
    label: 'Almacenamiento SSD M.2',
    options: [
      { name: 'Samsung 990 PRO 2TB NVMe PCIe 4.0', price: 599 },
      { name: 'Kingston NV2 1TB NVMe PCIe 4.0', price: 329 },
    ],
  },
]
