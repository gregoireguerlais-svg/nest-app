// Palette exacte du design Nest (voir CLAUDE.md, section 6 — source de vérité).
export const colors = {
  background: '#FAF6EF',
  backgroundSecondary: '#F3EBDD',
  surface: '#FEFDFB',
  border: '#E9DCC8',

  // Vert sauge — accent principal, profil Grégoire.
  sage: '#5E7A55', // sage-deep : traits, texte accent, éléments actifs
  sageFill: '#9DB48F', // sage : remplissages (illustrations)
  sageSoft: '#E7EDDF', // fonds sélectionnés légers

  // Terracotta — accent secondaire, profil Marine.
  // terra-deep (#9A5E42) est trop brun pour les boutons/éléments actifs : on utilise une
  // teinte intermédiaire, plus orangée et plus douce, entre terra-deep et terra.
  terracotta: '#C17E52', // traits, éléments actifs (boutons, coché, bordures)
  terracottaFill: '#C99478', // terra : remplissages
  terracottaSoft: '#F0E2D8', // fonds sélectionnés légers

  text: '#4A4640', // ink
  muted: '#888888',

  // Accents complémentaires, à utiliser avec parcimonie.
  honey: '#D6A24E',
  plum: '#A57BA5',
  rust: '#B66B47',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { card: 20, pill: 999 } as const;

export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
} as const;

export type MemberColor = 'sage' | 'terracotta';
