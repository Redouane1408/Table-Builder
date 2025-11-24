import { User, Wilaya, Canvas, Report, ChartData, CFCanvasData, CfContractRow } from './types';

export const mockWilayas: Wilaya[] = [
  { id: '1', name: 'Algiers', code: 'DZ-16' },
  { id: '2', name: 'Oran', code: 'DZ-31' },
  { id: '3', name: 'Constantine', code: 'DZ-25' },
  { id: '4', name: 'Annaba', code: 'DZ-23' },
  { id: '5', name: 'Blida', code: 'DZ-09' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'cf.user@example.com',
    role: 'CF',
    wilaya_id: '1',
    wilaya_name: 'Algiers',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'drb.admin@example.com',
    role: 'DRB',
    wilaya_id: '1',
    wilaya_name: 'Algiers',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'dgb.superadmin@example.com',
    role: 'DGB',
    wilaya_id: '1',
    wilaya_name: 'Algiers',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockCanvases: Canvas[] = [
  {
    id: '1',
    user_id: '1',
    wilaya_id: '1',
    period: '2024-Q1',
    data: {
      population: 2500000,
      economic_growth: 3.2,
      unemployment_rate: 12.5,
      inflation_rate: 2.1,
      contracts: [
        {
          id: 'c-1',
          service_contractant: { source: 'Budget Etat', label: 'Programme national' },
          partenaire_cocontractant: 'Entreprise A',
          objet_du_marche: "Construction d'école",
          forme_du_marche: 'travaux',
          nature_prestation: 'Marché',
          mode_passation: "Appel d'offres ouvert",
          montant_versement_dzd: 120000000,
          taux_versement_pct: 20,
          montant_ttc_dzd: 150000000,
          montant_avenant_dzd: 5000000,
          montant_final_marche_dzd: 155000000,
          montant_en_devise: { amount: 0, currency: 'DZD' },
        },
      ] as CfContractRow[],
    } as CFCanvasData,
    status: 'submitted',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    submitted_at: '2024-01-20T00:00:00Z',
    user: mockUsers[0],
    wilaya: mockWilayas[0],
  },
  {
    id: '2',
    user_id: '1',
    wilaya_id: '1',
    period: '2024-Q2',
    data: {
      population: 2520000,
      economic_growth: 3.5,
      unemployment_rate: 11.8,
      inflation_rate: 1.9,
      contracts: [] as CfContractRow[],
    } as CFCanvasData,
    status: 'draft',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-15T00:00:00Z',
    user: mockUsers[0],
    wilaya: mockWilayas[0],
  },
];

export const mockChartData: ChartData[] = [
  { label: 'Algiers', value: 2500000, color: '#3b82f6' },
  { label: 'Oran', value: 1800000, color: '#10b981' },
  { label: 'Constantine', value: 1200000, color: '#f59e0b' },
  { label: 'Annaba', value: 900000, color: '#ef4444' },
  { label: 'Blida', value: 700000, color: '#8b5cf6' },
];

export const mockEconomicData = [
  { name: 'Jan', economic_growth: 2.8, unemployment_rate: 13.2, inflation_rate: 2.3 },
  { name: 'Feb', economic_growth: 3.1, unemployment_rate: 12.8, inflation_rate: 2.1 },
  { name: 'Mar', economic_growth: 3.2, unemployment_rate: 12.5, inflation_rate: 2.1 },
  { name: 'Apr', economic_growth: 3.4, unemployment_rate: 12.2, inflation_rate: 1.9 },
  { name: 'May', economic_growth: 3.5, unemployment_rate: 11.8, inflation_rate: 1.9 },
  { name: 'Jun', economic_growth: 3.6, unemployment_rate: 11.5, inflation_rate: 1.8 },
];

export const mockReports: Report[] = [
  {
    id: '1',
    user_id: '1',
    canvas_id: '1',
    title: 'Q1 2024 Economic Report - Algiers',
    content: 'Comprehensive economic analysis for Q1 2024 showing positive growth trends...',
    status: 'submitted',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
    user: mockUsers[0],
    canvas: mockCanvases[0],
  },
];

export const mockNotifications = [
  { id: 'n1', title: 'Nouveau modèle créé', description: 'Algiers Q2 2024', time: 'il y a 2 heures', type: 'info' },
  { id: 'n2', title: 'Rapport soumis', description: 'Oran - Économie', time: 'il y a 4 heures', type: 'success' },
  { id: 'n3', title: 'Données mises à jour', description: 'Constantine', time: 'il y a 6 heures', type: 'warning' },
];

export const mockApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(r => setTimeout(r, 200));
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') throw new Error('Invalid credentials');
    return { user, token: 'mock-jwt-token' };
  },
  getChartData: async (): Promise<ChartData[]> => {
    await new Promise(r => setTimeout(r, 150));
    return mockChartData;
  },
  getEconomicData: async (): Promise<any[]> => {
    await new Promise(r => setTimeout(r, 150));
    return mockEconomicData;
  },
  getCanvases: async (): Promise<Canvas[]> => {
    await new Promise(r => setTimeout(r, 150));
    return mockCanvases;
  },
  getUsers: async (role?: string): Promise<User[]> => {
    await new Promise(r => setTimeout(r, 150));
    return role ? mockUsers.filter(u => u.role === role) : mockUsers;
  },
  getReports: async (user_id?: string): Promise<Report[]> => {
    await new Promise(r => setTimeout(r, 150));
    return user_id ? mockReports.filter(r => r.user_id === user_id) : mockReports;
  },
  getNotifications: async (): Promise<any[]> => {
    await new Promise(r => setTimeout(r, 100));
    return mockNotifications;
  },
  getCanvasById: async (id: string): Promise<Canvas | undefined> => {
    await new Promise(r => setTimeout(r, 100));
    return mockCanvases.find(c => c.id === id);
  },
  createCanvas: async (canvas: Partial<Canvas> & { data?: CFCanvasData }): Promise<Canvas> => {
    await new Promise(r => setTimeout(r, 150));
    const id = String(mockCanvases.length + 1);
    const now = new Date().toISOString();
    const newCanvas: Canvas = {
      id,
      user_id: canvas.user_id || mockUsers[0].id,
      wilaya_id: canvas.wilaya_id || mockUsers[0].wilaya_id,
      period: canvas.period || '2024-Q3',
      data: canvas.data || { contracts: [] },
      status: 'draft',
      created_at: now,
      updated_at: now,
      user: mockUsers.find(u => u.id === (canvas.user_id || mockUsers[0].id)),
      wilaya: mockWilayas.find(w => w.id === (canvas.wilaya_id || mockUsers[0].wilaya_id)),
    };
    mockCanvases.push(newCanvas);
    return newCanvas;
  },
  addContractRow: async (canvasId: string, row: CfContractRow): Promise<Canvas> => {
    await new Promise(r => setTimeout(r, 100));
    const canvas = mockCanvases.find(c => c.id === canvasId);
    if (!canvas) throw new Error('Canvas not found');
    const data = canvas.data as CFCanvasData;
    data.contracts = [...(data.contracts || []), row];
    canvas.updated_at = new Date().toISOString();
    return canvas;
  },
  deleteContractRow: async (canvasId: string, rowId: string): Promise<Canvas> => {
    await new Promise(r => setTimeout(r, 100));
    const canvas = mockCanvases.find(c => c.id === canvasId);
    if (!canvas) throw new Error('Canvas not found');
    const data = canvas.data as CFCanvasData;
    data.contracts = (data.contracts || []).filter(r => r.id !== rowId);
    canvas.updated_at = new Date().toISOString();
    return canvas;
  },
  submitCanvas: async (canvasId: string): Promise<Canvas> => {
    await new Promise(r => setTimeout(r, 150));
    const canvas = mockCanvases.find(c => c.id === canvasId);
    if (!canvas) throw new Error('Canvas not found');
    canvas.status = 'submitted';
    canvas.submitted_at = new Date().toISOString();
    canvas.updated_at = canvas.submitted_at;
    return canvas;
  },
};

export type Report = any;
