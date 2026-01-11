
export interface VisualStyleDefinition {
  styleName: string;
  styleId: string;
  compatibility: string[];
  totalScore: number;
  tags: string[]; // Added tags for categorization
  overallDesignSettings: {
    tone: string;
  };
  visualIdentity: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    secondaryColors: string[]; // Added to capture more than 3 colors
  };
  imageStyle: {
    features: string;
    texture: string;
    composition: string;
    lighting: string;
    details: Array<{ label: string; value: string }>;
  };
  typography: {
    heading: string;
    details: Array<{ label: string; value: string }>;
  };
  scores: {
    legibility: number;
    hierarchy: number;
    composition: number;
    themeFit: number;
    visualImpact: number;
  };
  previewImage?: string;
}

export interface SavedStyle extends VisualStyleDefinition {
  id: string;
  timestamp: number;
  originalImage: string;
  userEmail?: string;
  userName?: string;
  isPublic?: boolean; // Track if shared to community
}

export interface UserSession {
  username: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
  hasKey: boolean;
  isAdmin: boolean;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: VisualStyleDefinition | null;
  imagePreview: string | null;
}
