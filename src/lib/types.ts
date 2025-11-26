export interface User {
  id: string;
  email: string;
  role: 'CF' | 'DRB' | 'DGB';
  wilaya_id: string;
  wilaya_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Wilaya {
  id: string;
  name: string;
  code: string;
}

export interface Canvas {
  id: string;
  user_id: string;
  wilaya_id: string;
  period: string;
  data: Record<string, any>;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  user?: User;
  wilaya?: Wilaya;
}

export type BudgetSource =
  | 'Budget Etat'
  | 'Budget Collectivité locale'
  | 'Budget EPIC/EPA..'
  | 'Budget wilaya'
  | 'Budget commune';

export type FormeMarche = 'travaux' | 'fournitures' | 'études' | 'services';

export type NaturePrestation =
  | 'Marché'
  | 'Marché à commande'
  | 'Contrart-Programme'
  | 'Etude et réalisation'
  | 'une tranche ferme et une ou plusieurs tranche(s) conditionnelle(s)';

export type ModePassation =
  | "Appel d'offres ouvert"
  | "Appel d'offres ouvert avec exigence de capacité minimales"
  | "Appel d'offres restreint"
  | 'Concour'
  | 'Négocier aprés consultation'
  | 'Négocié direct'
  | "Procédure de consultation des marchés"
  | "Procédure spécifique en cas d'urgence impérieuse";

export type Devise = 'DZD' | 'USD' | 'EUR';

export interface CfBudget {
  source: BudgetSource;
  label: string;
}

export interface CfMontantDevise {
  amount: number;
  currency: Devise;
}

export interface CfContractRow {
  id: string;
  service_contractant: CfBudget;
  partenaire_cocontractant: string;
  objet_du_marche: string;
  forme_du_marche: FormeMarche;
  nature_prestation: NaturePrestation;
  mode_passation: ModePassation;
  montant_versement_dzd: number;
  taux_versement_pct: number;
  montant_ttc_dzd: number;
  montant_avenant_dzd: number;
  montant_final_marche_dzd: number;
  montant_en_devise?: CfMontantDevise;
  dynamic_values?: Record<string, any>;
}

export interface CFCanvasData {
  contracts: CfContractRow[];
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface Report {
  id: string;
  user_id: string;
  canvas_id: string;
  title: string;
  content?: string;
  status: 'draft' | 'submitted' | 'approved';
  created_at: string;
  updated_at: string;
  user?: User;
  canvas?: Canvas;
}

export type DynamicColumnType = 'string' | 'dropdown' | 'percentage' | 'amount_dzd' | 'amount_fx';

export interface DynamicColumn {
  id: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  type: DynamicColumnType;
  options?: string[];
  options_bi?: { key: string; name_fr: string; name_ar: string }[];
  created_at: string;
  created_by?: string;
}

export interface BaseCanvaColumn {
  id: string;
  name: string;
  type: DynamicColumnType;
  note?: string;
}

export interface AvenantRow {
  id: string;
  numero_avenant: string;
  date_avenant: string;
  objet_avenant: string;
  type_avenant: 'additif' | 'soustractif' | 'reallocation';
  mode_passation?: ModePassation;
  montant_avenant_dzd: number;
  taux_variation_pct: number;
  nouveau_montant_final_dzd: number;
  montant_en_devise?: CfMontantDevise;
  motif?: string;
}

export interface AvenantCanvasData {
  avenants: AvenantRow[];
}

export interface DerivedCanvasColumn {
  id: string;
  key: string;
  name_fr: string;
  name_ar: string;
}

export interface DerivedCanvas {
  id: string;
  source_canva: 'marches' | 'avenants';
  source_column_id: string;
  name_fr: string;
  name_ar: string;
  columns: DerivedCanvasColumn[];
}
