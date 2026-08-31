export interface ReleaseItem {
  id: string;
  title: string;
  description: string;
}

export interface ReleaseSection {
  id: string;
  title: string;
  items: ReleaseItem[];
}

export interface VersionRelease {
  id: string;
  version: string;
  isLatest?: boolean;
  defaultExpanded?: boolean;
  sections: ReleaseSection[];
}
