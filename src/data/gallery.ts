export type MediaType = 'photo' | 'video';
export type Category = 'wedding' | 'wisuda';

export interface DrivePhoto {
  id: string;
  name: string;
  thumb: string;
  src: string;
  size: string;
  driveId: string;
  type: MediaType;
}

export interface DriveFolder {
  id: string;
  albumId: string;
  rawPhotos: DrivePhoto[];
  editedPhotos: DrivePhoto[];
  videos: DrivePhoto[];
}

export interface Album {
  id: string;
  title: string;
  category: Category;
  client: string;
  date: string;
  coverSrc: string;
  itemCount: number;
  videoCount: number;
  driveUrl: string;
  driveFolderId: string;
  shareToken: string;
}

export const albums: Album[] = [
  {
    id: 'alb-001',
    title: 'Pernikahan Reza & Anisa',
    category: 'wedding',
    client: 'Reza Firmansyah',
    date: '15 Maret 2026',
    coverSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format',
    itemCount: 248,
    videoCount: 3,
    driveUrl: 'https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs',
    driveFolderId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs',
    shareToken: 'reza-anisa-wedding-2026',
  },
  {
    id: 'alb-002',
    title: 'Wisuda Farah Diba',
    category: 'wisuda',
    client: 'Farah Diba',
    date: '22 Mei 2026',
    coverSrc: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&auto=format',
    itemCount: 134,
    videoCount: 2,
    driveUrl: 'https://drive.google.com/drive/folders/1CxiMVs0XRA5nFMdKvBdBZjgmUUqptlbt',
    driveFolderId: '1CxiMVs0XRA5nFMdKvBdBZjgmUUqptlbt',
    shareToken: 'farah-wisuda-ui-2026',
  },
  {
    id: 'alb-003',
    title: 'Pernikahan Dian & Hendra',
    category: 'wedding',
    client: 'Dian Pratiwi',
    date: '8 Juni 2026',
    coverSrc: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop&auto=format',
    itemCount: 312,
    videoCount: 5,
    driveUrl: 'https://drive.google.com/drive/folders/1DxiMVs0XRA5nFMdKvBdBZjgmUUqptlbu',
    driveFolderId: '1DxiMVs0XRA5nFMdKvBdBZjgmUUqptlbu',
    shareToken: 'dian-hendra-wedding-2026',
  },
  {
    id: 'alb-004',
    title: 'Wisuda Bimo Satriawan — ITB',
    category: 'wisuda',
    client: 'Bimo Satriawan',
    date: '10 Juli 2026',
    coverSrc: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=800&h=600&fit=crop&auto=format',
    itemCount: 98,
    videoCount: 1,
    driveUrl: 'https://drive.google.com/drive/folders/1ExiMVs0XRA5nFMdKvBdBZjgmUUqptlbv',
    driveFolderId: '1ExiMVs0XRA5nFMdKvBdBZjgmUUqptlbv',
    shareToken: 'bimo-wisuda-itb-2026',
  },
  {
    id: 'alb-005',
    title: 'Lamaran Nadia & Farhan',
    category: 'wedding',
    client: 'Nadia Kusuma',
    date: '1 September 2026',
    coverSrc: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&auto=format',
    itemCount: 155,
    videoCount: 2,
    driveUrl: 'https://drive.google.com/drive/folders/1FxiMVs0XRA5nFMdKvBdBZjgmUUqptlbw',
    driveFolderId: '1FxiMVs0XRA5nFMdKvBdBZjgmUUqptlbw',
    shareToken: 'nadia-farhan-lamaran-2026',
  },
];

// Mock photo data for album detail (simulates Drive RAW/EDITED folders)
export function getMockPhotos(albumId: string): DriveFolder {
  const rawSet = [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552', size: '24.1 MB' },
    { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b', size: '18.4 MB' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc', size: '31.2 MB' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a', size: '22.8 MB' },
    { src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330', size: '19.5 MB' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6', size: '27.3 MB' },
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', size: '15.6 MB' },
    { src: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78', size: '20.1 MB' },
    { src: 'https://images.unsplash.com/photo-1609220136736-443140cffec6', size: '16.9 MB' },
    { src: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e', size: '23.4 MB' },
    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f', size: '28.7 MB' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866', size: '14.2 MB' },
  ];

  const editedSet = [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552', size: '8.2 MB' },
    { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b', size: '7.5 MB' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc', size: '9.4 MB' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a', size: '6.7 MB' },
    { src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330', size: '5.2 MB' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6', size: '8.8 MB' },
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', size: '6.1 MB' },
    { src: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78', size: '7.0 MB' },
    { src: 'https://images.unsplash.com/photo-1609220136736-443140cffec6', size: '5.8 MB' },
    { src: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e', size: '4.9 MB' },
    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f', size: '7.8 MB' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866', size: '6.3 MB' },
  ];

  const rawPhotos: DrivePhoto[] = rawSet.map((p, i) => ({
    id: `raw-${albumId}-${i}`,
    name: `RAW_${String(i + 1).padStart(4, '0')}.ARW`,
    thumb: `${p.src}?w=400&h=300&fit=crop&auto=format&sat=-50`,
    src: `${p.src}?w=1600&h=1200&fit=crop&auto=format&sat=-50`,
    size: p.size,
    driveId: `raw_drive_id_${i}`,
    type: 'photo' as MediaType,
  }));

  const editedPhotos: DrivePhoto[] = editedSet.map((p, i) => ({
    id: `edited-${albumId}-${i}`,
    name: `EDITED_${String(i + 1).padStart(4, '0')}.jpg`,
    thumb: `${p.src}?w=400&h=300&fit=crop&auto=format`,
    src: `${p.src}?w=1600&h=1200&fit=crop&auto=format`,
    size: p.size,
    driveId: `edited_drive_id_${i}`,
    type: 'photo' as MediaType,
  }));

  const videos: DrivePhoto[] = [
    {
      id: `vid-${albumId}-0`,
      name: 'Highlight_Reel.mp4',
      thumb: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=225&fit=crop&auto=format',
      src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&h=900&fit=crop&auto=format',
      size: '2.3 GB',
      driveId: `vid_drive_id_0`,
      type: 'video' as MediaType,
    },
  ];

  return { id: albumId, albumId, rawPhotos, editedPhotos, videos };
}
