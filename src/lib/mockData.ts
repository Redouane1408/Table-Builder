import { User, Wilaya, Canvas, Report, ChartData, CFCanvasData, CfContractRow, DynamicColumn, BaseCanvaColumn, AvenantCanvasData, AvenantRow, DerivedCanvas, DerivedCanvasColumn, DRB, Commune, NewUserResult } from './types';

export const mockWilayas: Wilaya[] = [
  { id: '1', name: 'Algiers', code: 'DZ-16' },
  { id: '2', name: 'Oran', code: 'DZ-31' },
  { id: '3', name: 'Constantine', code: 'DZ-25' },
  { id: '4', name: 'Annaba', code: 'DZ-23' },
  { id: '5', name: 'Blida', code: 'DZ-09' },
];

export const mockDRBs: DRB[] = [
  { id: 'drb-1', name_fr: 'DRB Centre', name_ar: 'DRB الوسط' },
  { id: 'drb-2', name_fr: 'DRB Est', name_ar: 'DRB الشرق' },
  { id: 'drb-3', name_fr: 'DRB Ouest', name_ar: 'DRB الغرب' },
  { id: 'drb-4', name_fr: 'DRB Sud', name_ar: 'DRB الجنوب' },
  { id: 'drb-5', name_fr: 'DRB Hauts-Plateaux', name_ar: 'DRB الهضاب العليا' },
  { id: 'drb-6', name_fr: 'DRB Sahara', name_ar: 'DRB الصحراء' },
  { id: 'drb-7', name_fr: 'DRB Littoral', name_ar: 'DRB الساحل' },
];

export const mockCommunes: Commune[] = [
  { id: 'c-1', wilaya_id: '1', name_fr: 'Bab El Oued', name_ar: 'باب الوادي' },
  { id: 'c-2', wilaya_id: '1', name_fr: 'El Harrach', name_ar: 'الحراش' },
  { id: 'c-3', wilaya_id: '2', name_fr: 'Es Senia', name_ar: 'السانية' },
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

export const mockAvenantCanvases: Canvas[] = [
  {
    id: 'a-1',
    user_id: '1',
    wilaya_id: '1',
    period: '2024-Q1',
    data: {
      avenants: [
        {
          id: 'av-1',
          numero_avenant: 'AV-2024-01',
          date_avenant: '2024-02-10',
          objet_avenant: 'Extension de délai',
          type_avenant: 'additif',
          mode_passation: "Appel d'offres ouvert",
          montant_avenant_dzd: 5000000,
          taux_variation_pct: 3.2,
          nouveau_montant_final_dzd: 160000000,
          montant_en_devise: { amount: 0, currency: 'DZD' },
          motif: 'Contraintes techniques',
        } as AvenantRow,
      ],
    } as AvenantCanvasData,
    status: 'submitted',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
    submitted_at: '2024-02-10T00:00:00Z',
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

export const dynamicColumnsMarches: DynamicColumn[] = [];
export const dynamicColumnsAvenants: DynamicColumn[] = [];
export const derivedCanvasesMarches: DerivedCanvas[] = [];
export const derivedCanvasesAvenants: DerivedCanvas[] = [];
export const baseCanvaColumns: BaseCanvaColumn[] = [
  { id: 'base-1', name: 'Service Contractant', type: 'dropdown', note: 'sélection + libellé' },
  { id: 'base-2', name: 'Partenaire Cocontractant', type: 'string' },
  { id: 'base-3', name: 'Objet du marché', type: 'string' },
  { id: 'base-4', name: 'Forme du marché', type: 'dropdown' },
  { id: 'base-5', name: 'Nature de prestation', type: 'dropdown' },
  { id: 'base-6', name: 'Mode de passation du marché', type: 'dropdown' },
  { id: 'base-7', name: 'Montant des versement (DZD)', type: 'amount_dzd' },
  { id: 'base-8', name: 'Taux des versement (%)', type: 'percentage' },
  { id: 'base-9', name: 'Montant TTC (DZD)', type: 'amount_dzd' },
  { id: 'base-10', name: "Montant de l'avenant (DZD)", type: 'amount_dzd' },
  { id: 'base-11', name: 'Montant final du marché (DZD)', type: 'amount_dzd' },
  { id: 'base-12', name: 'Montant en devise', type: 'amount_fx' },
];
export const baseAvenantColumns: BaseCanvaColumn[] = [
  { id: 'av-base-1', name: "Numéro de l'avenant", type: 'string' },
  { id: 'av-base-2', name: "Date de l'avenant", type: 'string', note: 'date' },
  { id: 'av-base-3', name: "Objet de l'avenant", type: 'string' },
  { id: 'av-base-4', name: "Type d'avenant", type: 'dropdown' },
  { id: 'av-base-5', name: 'Mode de passation du marché', type: 'dropdown' },
  { id: 'av-base-6', name: "Montant de l'avenant (DZD)", type: 'amount_dzd' },
  { id: 'av-base-7', name: 'Taux de variation (%)', type: 'percentage' },
  { id: 'av-base-8', name: 'Nouveau montant final (DZD)', type: 'amount_dzd' },
  { id: 'av-base-9', name: 'Montant en devise', type: 'amount_fx' },
  { id: 'av-base-10', name: 'Motif', type: 'string' },
];
export const baseColumnOptions: Record<string, string[]> = {
  'Service Contractant': ['Budget Etat','Budget Collectivité locale','Budget EPIC/EPA..','Budget wilaya','Budget commune'],
  'Forme du marché': ['travaux','fournitures','études','services'],
  'Nature de prestation': ['Marché','Marché à commande','Contrart-Programme','Etude et réalisation','une tranche ferme et une ou plusieurs tranche(s) conditionnelle(s)'],
  'Mode de passation du marché': [
    "Appel d'offres ouvert",
    "Appel d'offres ouvert avec exigence de capacité minimales",
    "Appel d'offres restreint",
    'Concour',
    'Négocier aprés consultation',
    'Négocié direct',
    "Procédure de consultation des marchés",
    "Procédure spécifique en cas d'urgence impérieuse",
  ],
};
export const baseAvenantColumnOptions: Record<string, string[]> = {
  "Type d'avenant": ['additif','soustractif','reallocation'],
  'Mode de passation du marché': [
    "Appel d'offres ouvert",
    "Appel d'offres ouvert avec exigence de capacité minimales",
    "Appel d'offres restreint",
    'Concour',
    'Négocier aprés consultation',
    'Négocié direct',
    "Procédure de consultation des marchés",
    "Procédure spécifique en cas d'urgence impérieuse",
  ],
};

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
  createUser: async (email: string, role: 'CF'|'DRB'|'DGB', wilaya_id: string): Promise<NewUserResult> => {
    await new Promise(r => setTimeout(r, 120));
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const w = mockWilayas.find(x => x.id === wilaya_id);
    const u: User = { id, email, role, wilaya_id, wilaya_name: w?.name || '', created_at: now, updated_at: now } as User;
    mockUsers.push(u);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = '';
    for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    return { user: u, password: pwd } as NewUserResult;
  },
  updateUser: async (id: string, patch: Partial<Pick<User,'email'|'role'|'wilaya_id'>>): Promise<User> => {
    await new Promise(r => setTimeout(r, 120));
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    const prev = mockUsers[idx];
    const nextWilaya = typeof patch.wilaya_id === 'string' ? mockWilayas.find(w => w.id === patch.wilaya_id) : undefined;
    const next: User = { ...prev, ...patch, wilaya_name: nextWilaya ? nextWilaya.name : prev.wilaya_name, updated_at: new Date().toISOString() } as User;
    mockUsers[idx] = next;
    return next;
  },
  deleteUser: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 80));
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx !== -1) mockUsers.splice(idx, 1);
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
    return mockCanvases.find(c => c.id === id) || mockAvenantCanvases.find(c => c.id === id);
  },
  getAvenantCanvases: async (): Promise<Canvas[]> => {
    await new Promise(r => setTimeout(r, 150));
    return mockAvenantCanvases;
  },
  listDynamicColumns: async (): Promise<DynamicColumn[]> => {
    await new Promise(r => setTimeout(r, 100));
    return dynamicColumnsMarches;
  },
  listDynamicColumnsFor: async (canva: 'marches'|'avenants'): Promise<DynamicColumn[]> => {
    await new Promise(r => setTimeout(r, 100));
    return canva === 'marches' ? dynamicColumnsMarches : dynamicColumnsAvenants;
  },
  getBaseCanvaColumns: async (): Promise<BaseCanvaColumn[]> => {
    await new Promise(r => setTimeout(r, 50));
    return baseCanvaColumns;
  },
  getBaseColumnsFor: async (canva: 'marches'|'avenants'): Promise<BaseCanvaColumn[]> => {
    await new Promise(r => setTimeout(r, 50));
    return canva === 'marches' ? baseCanvaColumns : baseAvenantColumns;
  },
  getBaseColumnOptions: async (name: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 50));
    return baseColumnOptions[name] ? [...baseColumnOptions[name]] : [];
  },
  getBaseColumnOptionsFor: async (canva: 'marches'|'avenants', name: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 50));
    const dict = canva === 'marches' ? baseColumnOptions : baseAvenantColumnOptions;
    return dict[name] ? [...dict[name]] : [];
  },
  addBaseColumnOption: async (name: string, opt: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 100));
    const list = baseColumnOptions[name] || (baseColumnOptions[name] = []);
    if (!list.includes(opt)) list.push(opt);
    return [...list];
  },
  addBaseColumnOptionFor: async (canva: 'marches'|'avenants', name: string, opt: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 100));
    const dict = canva === 'marches' ? baseColumnOptions : baseAvenantColumnOptions;
    const list = dict[name] || (dict[name] = []);
    if (!list.includes(opt)) list.push(opt);
    return [...list];
  },
  deleteBaseColumnOption: async (name: string, opt: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 100));
    const list = baseColumnOptions[name] || [];
    baseColumnOptions[name] = list.filter(o => o !== opt);
    return [...baseColumnOptions[name]];
  },
  deleteBaseColumnOptionFor: async (canva: 'marches'|'avenants', name: string, opt: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 100));
    const dict = canva === 'marches' ? baseColumnOptions : baseAvenantColumnOptions;
    const list = dict[name] || [];
    dict[name] = list.filter(o => o !== opt);
    return [...dict[name]];
  },
  updateBaseColumnOption: async (name: string, prev: string, next: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 120));
    const list = baseColumnOptions[name] || [];
    const idx = list.findIndex(o => o === prev);
    if (idx !== -1) list[idx] = next;
    baseColumnOptions[name] = list;
    return [...list];
  },
  updateBaseColumnOptionFor: async (canva: 'marches'|'avenants', name: string, prev: string, next: string): Promise<string[]> => {
    await new Promise(r => setTimeout(r, 120));
    const dict = canva === 'marches' ? baseColumnOptions : baseAvenantColumnOptions;
    const list = dict[name] || [];
    const idx = list.findIndex(o => o === prev);
    if (idx !== -1) list[idx] = next;
    dict[name] = list;
    return [...list];
  },
  updateBaseColumn: async (id: string, patch: Partial<Pick<BaseCanvaColumn,'name'|'type'|'note'>>): Promise<BaseCanvaColumn> => {
    await new Promise(r => setTimeout(r, 120));
    const idx = baseCanvaColumns.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Base column not found');
    const next: BaseCanvaColumn = { ...baseCanvaColumns[idx], ...patch } as BaseCanvaColumn;
    baseCanvaColumns[idx] = next;
    return next;
  },
  deleteBaseColumn: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 120));
    const idx = baseCanvaColumns.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Base column not found');
    baseCanvaColumns.splice(idx, 1);
  },
  addDynamicColumn: async (def: Omit<DynamicColumn, 'id' | 'created_at'>): Promise<DynamicColumn> => {
    await new Promise(r => setTimeout(r, 150));
    const col: DynamicColumn = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...def } as DynamicColumn;
    dynamicColumnsMarches.push(col);
    return col;
  },
  addDynamicColumnFor: async (canva: 'marches'|'avenants', def: Omit<DynamicColumn, 'id' | 'created_at'>): Promise<DynamicColumn> => {
    await new Promise(r => setTimeout(r, 150));
    const col: DynamicColumn = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...def } as DynamicColumn;
    if (!col.name && col.name_fr) col.name = col.name_fr;
    (canva === 'marches' ? dynamicColumnsMarches : dynamicColumnsAvenants).push(col);
    if (col.type === 'dropdown') {
      const derived: DerivedCanvas = {
        id: crypto.randomUUID(),
        source_canva: canva,
        source_column_id: col.id,
        name_fr: (col as any).derived_name_fr || col.name_fr || col.name,
        name_ar: (col as any).derived_name_ar || col.name_ar || col.name,
        columns: (col.options_bi && col.options_bi.length
          ? col.options_bi.map(o => ({ id: crypto.randomUUID(), key: o.key, name_fr: o.name_fr, name_ar: o.name_ar }))
          : (col.options || []).map(o => ({ id: crypto.randomUUID(), key: o, name_fr: o, name_ar: o }))
        ),
      };
      (canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants).push(derived);
    }
    return col;
  },
  updateDynamicColumn: async (id: string, patch: Partial<Pick<DynamicColumn, 'name'|'type'|'options'>>): Promise<DynamicColumn> => {
    await new Promise(r => setTimeout(r, 120));
    const idx = dynamicColumnsMarches.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Column not found');
    const current = dynamicColumnsMarches[idx];
    const next: DynamicColumn = { ...current, ...patch } as DynamicColumn;
    dynamicColumnsMarches[idx] = next;
    return next;
  },
  updateDynamicColumnFor: async (canva: 'marches'|'avenants', id: string, patch: Partial<Pick<DynamicColumn, 'name'|'type'|'options'>>): Promise<DynamicColumn> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? dynamicColumnsMarches : dynamicColumnsAvenants;
    const idx = arr.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Column not found');
    const current = arr[idx];
    const next: DynamicColumn = { ...current, ...patch } as DynamicColumn;
    arr[idx] = next;
    if (current.type === 'dropdown') {
      const dArr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
      const dIdx = dArr.findIndex(dc => dc.source_column_id === id);
      if (dIdx !== -1) {
        const dc = dArr[dIdx];
        const nameFr = (patch as any).derived_name_fr as string | undefined ?? (patch as any).name_fr as string | undefined;
        const nameAr = (patch as any).derived_name_ar as string | undefined ?? (patch as any).name_ar as string | undefined;
        if (typeof nameFr === 'string' && nameFr) dc.name_fr = nameFr;
        if (typeof nameAr === 'string' && nameAr) dc.name_ar = nameAr;
        const optionsBi = (patch as any).options_bi as { key: string; name_fr: string; name_ar: string }[] | undefined;
        if (optionsBi && Array.isArray(optionsBi)) {
          const updatedCols: DerivedCanvasColumn[] = [];
          for (const o of optionsBi) {
            const found = dc.columns.find(c => c.key === o.key);
            updatedCols.push(found ? { ...found, name_fr: o.name_fr, name_ar: o.name_ar } : { id: crypto.randomUUID(), key: o.key, name_fr: o.name_fr, name_ar: o.name_ar });
          }
          dc.columns = updatedCols;
        } else if (patch.options) {
          const updatedCols: DerivedCanvasColumn[] = [];
          for (const key of patch.options) {
            const found = dc.columns.find(c => c.key === key);
            updatedCols.push(found ? found : { id: crypto.randomUUID(), key, name_fr: key, name_ar: key });
          }
          dc.columns = updatedCols;
        }
        dArr[dIdx] = dc;
      } else if (patch.type === 'dropdown') {
        const derived: DerivedCanvas = {
          id: crypto.randomUUID(),
          source_canva: canva,
          source_column_id: id,
          name_fr: (next as any).name_fr || next.name,
          name_ar: (next as any).name_ar || next.name,
          columns: ((next as any).options_bi && (next as any).options_bi.length
            ? (next as any).options_bi.map((o: any) => ({ id: crypto.randomUUID(), key: o.key, name_fr: o.name_fr, name_ar: o.name_ar }))
            : (next.options || []).map(o => ({ id: crypto.randomUUID(), key: o, name_fr: o, name_ar: o }))
          ),
        };
        dArr.push(derived);
      }
    }
    return next;
  },
  deleteDynamicColumn: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 120));
    const idx = dynamicColumnsMarches.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Column not found');
    dynamicColumnsMarches.splice(idx, 1);
  },
  deleteDynamicColumnFor: async (canva: 'marches'|'avenants', id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? dynamicColumnsMarches : dynamicColumnsAvenants;
    const idx = arr.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Column not found');
    arr.splice(idx, 1);
    const dArr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    const dIdx = dArr.findIndex(dc => dc.source_column_id === id);
    if (dIdx !== -1) dArr.splice(dIdx, 1);
  },
  getDropdownConsolidation: async (name: string): Promise<{ option: string; count: number }[]> => {
    await new Promise(r => setTimeout(r, 150));
    const col = dynamicColumnsMarches.find(c => c.name === name && c.type === 'dropdown');
    if (!col) return [];
    const counts: Record<string, number> = {};
    for (const c of mockCanvases) {
      const data = c.data as CFCanvasData;
      for (const row of data.contracts || []) {
        const val = row.dynamic_values?.[name];
        if (typeof val === 'string') counts[val] = (counts[val] || 0) + 1;
      }
    }
    const options = col.options || Object.keys(counts);
    return options.map(opt => ({ option: opt, count: counts[opt] || 0 }));
  },
  listDerivedCanvasesFor: async (canva: 'marches'|'avenants'): Promise<DerivedCanvas[]> => {
    await new Promise(r => setTimeout(r, 80));
    const arr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    return arr.map(dc => ({ ...dc }));
  },
  updateDerivedCanvasNames: async (canva: 'marches'|'avenants', id: string, name_fr: string, name_ar: string): Promise<DerivedCanvas> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    const idx = arr.findIndex(dc => dc.id === id);
    if (idx === -1) throw new Error('Derived canvas not found');
    const next = { ...arr[idx], name_fr, name_ar } as DerivedCanvas;
    arr[idx] = next;
    return next;
  },
  updateDerivedCanvasColumnNames: async (canva: 'marches'|'avenants', id: string, key: string, name_fr: string, name_ar: string): Promise<DerivedCanvas> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    const idx = arr.findIndex(dc => dc.id === id);
    if (idx === -1) throw new Error('Derived canvas not found');
    const dc = { ...arr[idx] } as DerivedCanvas;
    dc.columns = dc.columns.map(c => c.key === key ? { ...c, name_fr, name_ar } : c);
    arr[idx] = dc;
    return dc;
  },
  getDerivedCanvasCounts: async (canva: 'marches'|'avenants', id: string): Promise<{ key: string; count: number }[]> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    const dc = arr.find(d => d.id === id);
    if (!dc) return [];
    if (canva === 'marches') {
      const srcCol = (dynamicColumnsMarches.find(c => c.id === dc.source_column_id));
      const name = srcCol?.name || '';
      const counts: Record<string, number> = {};
      for (const c of mockCanvases) {
        const data = c.data as CFCanvasData;
        for (const row of data.contracts || []) {
          const val = row.dynamic_values?.[name];
          if (typeof val === 'string') counts[val] = (counts[val] || 0) + 1;
        }
      }
      return dc.columns.map(col => ({ key: col.key, count: counts[col.key] || 0 }));
    }
    return dc.columns.map(col => ({ key: col.key, count: 0 }));
  },
  getDerivedCanvasAmounts: async (canva: 'marches'|'avenants', id: string): Promise<{ key: string; amount: number }[]> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    const dc = arr.find(d => d.id === id);
    if (!dc) return [];
    if (canva === 'marches') {
      const srcCol = (dynamicColumnsMarches.find(c => c.id === dc.source_column_id));
      const name = srcCol?.name || '';
      const sums: Record<string, number> = {};
      for (const c of mockCanvases) {
        const data = c.data as CFCanvasData;
        for (const row of data.contracts || []) {
          const val = row.dynamic_values?.[name];
          if (typeof val === 'string') {
            sums[val] = (sums[val] || 0) + (row.montant_final_marche_dzd || 0);
          }
        }
      }
      return dc.columns.map(col => ({ key: col.key, amount: sums[col.key] || 0 }));
    }
    return dc.columns.map(col => ({ key: col.key, amount: 0 }));
  },
  getDerivedCanvasPivot: async (canva: 'marches'|'avenants', id: string): Promise<{ wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[]> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    const dc = arr.find(d => d.id === id);
    if (!dc) return [];
    const rows: { wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[] = [];
    if (canva === 'marches') {
      const srcCol = dynamicColumnsMarches.find(c => c.id === dc.source_column_id);
      const name = srcCol?.name || '';
      for (const w of mockWilayas) {
        const counts: Record<string, number> = {};
        for (const col of dc.columns) counts[col.key] = 0;
        for (const canvas of mockCanvases.filter(c => c.wilaya_id === w.id)) {
          const data = canvas.data as CFCanvasData;
          for (const row of data.contracts || []) {
            const val = row.dynamic_values?.[name];
            if (typeof val === 'string' && counts.hasOwnProperty(val)) counts[val] += 1;
          }
        }
        rows.push({ wilaya_id: w.id, wilaya_name: w.name, counts });
      }
      return rows;
    }
    for (const w of mockWilayas) {
      const counts: Record<string, number> = {};
      for (const col of dc.columns) counts[col.key] = 0;
      rows.push({ wilaya_id: w.id, wilaya_name: w.name, counts });
    }
    return rows;
  },
  getDerivedCanvasPivotAmounts: async (canva: 'marches'|'avenants', id: string): Promise<{ wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[]> => {
    await new Promise(r => setTimeout(r, 120));
    const arr = canva === 'marches' ? derivedCanvasesMarches : derivedCanvasesAvenants;
    const dc = arr.find(d => d.id === id);
    if (!dc) return [];
    const rows: { wilaya_id: string; wilaya_name: string; counts: Record<string, number> }[] = [];
    if (canva === 'marches') {
      const srcCol = dynamicColumnsMarches.find(c => c.id === dc.source_column_id);
      const name = srcCol?.name || '';
      for (const w of mockWilayas) {
        const sums: Record<string, number> = {};
        for (const col of dc.columns) sums[col.key] = 0;
        for (const canvas of mockCanvases.filter(c => c.wilaya_id === w.id)) {
          const data = canvas.data as CFCanvasData;
          for (const row of data.contracts || []) {
            const val = row.dynamic_values?.[name];
            if (typeof val === 'string' && sums.hasOwnProperty(val)) sums[val] += (row.montant_final_marche_dzd || 0);
          }
        }
        rows.push({ wilaya_id: w.id, wilaya_name: w.name, counts: sums });
      }
      return rows;
    }
    for (const w of mockWilayas) {
      const sums: Record<string, number> = {};
      for (const col of dc.columns) sums[col.key] = 0;
      rows.push({ wilaya_id: w.id, wilaya_name: w.name, counts: sums });
    }
    return rows;
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
    const canvas = mockCanvases.find(c => c.id === canvasId) || mockAvenantCanvases.find(c => c.id === canvasId);
    if (!canvas) throw new Error('Canvas not found');
    canvas.status = 'submitted';
    canvas.submitted_at = new Date().toISOString();
    canvas.updated_at = canvas.submitted_at;
    return canvas;
  },
  createAvenantCanvas: async (canvas: Partial<Canvas> & { data?: AvenantCanvasData }): Promise<Canvas> => {
    await new Promise(r => setTimeout(r, 150));
    const id = `a-${mockAvenantCanvases.length + 1}`;
    const now = new Date().toISOString();
    const newCanvas: Canvas = {
      id,
      user_id: canvas.user_id || mockUsers[0].id,
      wilaya_id: canvas.wilaya_id || mockUsers[0].wilaya_id,
      period: canvas.period || '2024-Q3',
      data: canvas.data || { avenants: [] },
      status: 'draft',
      created_at: now,
      updated_at: now,
      user: mockUsers.find(u => u.id === (canvas.user_id || mockUsers[0].id)),
      wilaya: mockWilayas.find(w => w.id === (canvas.wilaya_id || mockUsers[0].wilaya_id)),
    };
    mockAvenantCanvases.push(newCanvas);
    return newCanvas;
  },
  addAvenantRow: async (canvasId: string, row: AvenantRow): Promise<Canvas> => {
    await new Promise(r => setTimeout(r, 120));
    const canvas = mockAvenantCanvases.find(c => c.id === canvasId);
    if (!canvas) throw new Error('Avenant canvas not found');
    const data = canvas.data as AvenantCanvasData;
    data.avenants = [...(data.avenants || []), row];
    canvas.updated_at = new Date().toISOString();
    return canvas;
  },
  deleteAvenantRow: async (canvasId: string, rowId: string): Promise<Canvas> => {
    await new Promise(r => setTimeout(r, 120));
    const canvas = mockAvenantCanvases.find(c => c.id === canvasId);
    if (!canvas) throw new Error('Avenant canvas not found');
    const data = canvas.data as AvenantCanvasData;
    data.avenants = (data.avenants || []).filter(r => r.id !== rowId);
    canvas.updated_at = new Date().toISOString();
    return canvas;
  },
  // Metadata CRUD
  listDRBs: async (): Promise<DRB[]> => { await new Promise(r => setTimeout(r, 50)); return [...mockDRBs]; },
  addDRB: async (fr: string, ar: string): Promise<DRB> => { await new Promise(r => setTimeout(r, 80)); const d: DRB = { id: crypto.randomUUID(), name_fr: fr, name_ar: ar || fr }; mockDRBs.push(d); return d; },
  updateDRB: async (id: string, fr: string, ar: string): Promise<DRB> => { await new Promise(r => setTimeout(r, 80)); const idx = mockDRBs.findIndex(d => d.id === id); if (idx === -1) throw new Error('DRB not found'); const next = { ...mockDRBs[idx], name_fr: fr, name_ar: ar } as DRB; mockDRBs[idx] = next; return next; },
  deleteDRB: async (id: string): Promise<void> => { await new Promise(r => setTimeout(r, 80)); const idx = mockDRBs.findIndex(d => d.id === id); if (idx !== -1) mockDRBs.splice(idx, 1); for (const w of mockWilayas) if (w.drb_id === id) w.drb_id = undefined; },

  listWilayas: async (): Promise<Wilaya[]> => { await new Promise(r => setTimeout(r, 50)); return [...mockWilayas]; },
  addWilaya: async (name_fr: string, name_ar: string, code: string, drb_id?: string): Promise<Wilaya> => { await new Promise(r => setTimeout(r, 80)); const w: Wilaya = { id: crypto.randomUUID(), name: name_fr, name_fr, name_ar, code, drb_id }; mockWilayas.push(w); return w; },
  updateWilaya: async (id: string, patch: Partial<Pick<Wilaya,'name_fr'|'name_ar'|'code'|'drb_id'>>): Promise<Wilaya> => { await new Promise(r => setTimeout(r, 80)); const idx = mockWilayas.findIndex(w => w.id === id); if (idx === -1) throw new Error('Wilaya not found'); const next = { ...mockWilayas[idx], ...patch } as Wilaya; if (patch.name_fr) next.name = patch.name_fr; mockWilayas[idx] = next; return next; },
  deleteWilaya: async (id: string): Promise<void> => { await new Promise(r => setTimeout(r, 80)); const idx = mockWilayas.findIndex(w => w.id === id); if (idx !== -1) mockWilayas.splice(idx, 1); for (let i = mockCommunes.length - 1; i >= 0; i--) if (mockCommunes[i].wilaya_id === id) mockCommunes.splice(i, 1); },

  listCommunes: async (wilaya_id?: string): Promise<Commune[]> => { await new Promise(r => setTimeout(r, 50)); const arr = [...mockCommunes]; return wilaya_id ? arr.filter(c => c.wilaya_id === wilaya_id) : arr; },
  addCommune: async (wilaya_id: string, name_fr: string, name_ar: string): Promise<Commune> => { await new Promise(r => setTimeout(r, 80)); const c: Commune = { id: crypto.randomUUID(), wilaya_id, name_fr, name_ar }; mockCommunes.push(c); return c; },
  updateCommune: async (id: string, patch: Partial<Pick<Commune,'name_fr'|'name_ar'|'wilaya_id'>>): Promise<Commune> => { await new Promise(r => setTimeout(r, 80)); const idx = mockCommunes.findIndex(c => c.id === id); if (idx === -1) throw new Error('Commune not found'); const next = { ...mockCommunes[idx], ...patch } as Commune; mockCommunes[idx] = next; return next; },
  deleteCommune: async (id: string): Promise<void> => { await new Promise(r => setTimeout(r, 80)); const idx = mockCommunes.findIndex(c => c.id === id); if (idx !== -1) mockCommunes.splice(idx, 1); },
};
