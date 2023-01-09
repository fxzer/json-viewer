export interface State{
  themeActive:string,
  themeList:ThemeItem[]
}
export interface ThemeItem{
  label: string;
  key: string;
  color: string;
  bgcolor: string;
  hbcolor: string;
  hcolor: string;
}