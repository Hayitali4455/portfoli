export type ProjectCategory = 
  | 'all'
  | 'agriculture'
  | 'forestry'
  | 'ecology'
  | 'cadastre'
  | 'ai-arcgis-tools'
  | '3d-modeling'
  | 'ai-tools'
  | 'arcgis-tools'
  | 'remote-sensing'
  | 'urban-cadastre'
  | 'spatial-analysis'
  | 'webgis'
  | 'hydrology-eco';

export interface BeforeAfterComparison {
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
  description: string;
}

export interface DatasetInfo {
  areaSize?: string;
  scale?: string;
  crs?: string;
  format?: string;
  dataSources?: string;
}

export interface AIModelInfo {
  framework?: string;       // Masalan: PyTorch, TensorFlow, YOLOv8, OpenCV, SAM
  modelType?: string;       // Masalan: Object Detection, Semantic Segmentation, Classification, LLM Agent
  accuracy?: string;        // Masalan: 95.4% mAP50, 92.1% IoU
  inputData?: string;       // Masalan: 10m Sentinel-2, Yuqori aniqlikdagi dron ortofotomozayka
  outputData?: string;      // Masalan: GeoJSON bino poligonlari, GeoTIFF maska
  architecture?: string;    // Masalan: YOLOv8x-seg, DeepLabV3+, Mask R-CNN
}

export interface ArcGISProToolInfo {
  toolboxType?: string;     // Masalan: Python Toolbox (.pyt), Script Tool, ModelBuilder, Add-In
  arcgisVersion?: string;   // Masalan: ArcGIS Pro 3.0 / 3.1 / 3.2+
  pythonVersion?: string;   // Masalan: Python 3.9 (conda arcgispro-py3)
  keyModules?: string[];    // Masalan: ['arcpy', 'arcpy.mp', 'arcpy.sa', 'arcpy.da']
  parametersList?: string[];// Masalan: ['Kiruvchi kadastr qatlami', 'Bufer radiusi', 'Chiquvchi GDB']
}

export interface ZipFileInfo {
  name: string;
  size: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface DownloadRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  userEmail: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
  notes?: string;
}

export interface GISProject {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'all'>;
  shortDescription: string;
  fullDescription: string;
  taskDescription?: string; // Dastur nima vazifani bajarishi haqida batafsil izoh
  tools: string[];
  year: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  imageUrl: string;
  additionalImages?: string[];
  beforeAfter?: BeforeAfterComparison;
  datasetInfo?: DatasetInfo;
  aiModelInfo?: AIModelInfo;
  arcgisToolInfo?: ArcGISProToolInfo;
  codeSnippet?: string;          // Python / ArcPy skript kodi
  downloadUrl?: string;          // Dastur yoki toolni yuklab olish havolasi
  zipFile?: ZipFileInfo;         // Yuklangan .zip fayl arxivi
  requiresAdminPermission?: boolean; // Admin ruxsati talab etiladi (sukut bo'yicha ha)
  githubUrl?: string;            // GitHub repozitoriy havolasi
  usageInstructions?: string;    // Qanday ishlatish bo'yicha ko'rsatma
  methodology?: string[];
  results?: string[];
  geojsonSample?: any;
  liveDemoUrl?: string;
  isUserAdded?: boolean;
  isProgram?: boolean;
  programVersion?: string;
  uploadedLayerInfo?: {
    name: string;
    format: string;
    featureCount: number;
    geometryTypes: string[];
  };
  createdAt: string;
}

export interface FilterState {
  category: ProjectCategory;
  searchQuery: string;
  tool: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  createdAt: string;
  role?: string;
}

export interface GISSkill {
  name: string;
  level: number;
  desc?: string;
}

export interface GISSkillCategory {
  category: string;
  skills: GISSkill[];
}

export interface WorkExperience {
  role: string;
  organization: string;
  period: string;
  location: string;
  highlights: string[];
}


