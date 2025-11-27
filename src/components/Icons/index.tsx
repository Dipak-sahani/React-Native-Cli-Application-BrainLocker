import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple icon components (you can replace with your preferred icon library)
export const PlusIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>+</Text>
);

export const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>✓</Text>
);

export const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>→</Text>
);

export const SaveIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>💾</Text>
);

export const DeleteIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🗑️</Text>
);




export const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>×</Text>
);

export const BookIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>📚</Text>
);
export const EyeIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>👁️</Text>
);

export const EyeOffIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🙈</Text>
);

export const TrashIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🗑️</Text>
);

export const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>←</Text>
);

// Add these to your existing icons:
export const SunIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>☀️</Text>
);

export const MoonIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🌙</Text>
);

export const AutoThemeIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>⚙️</Text>
);

export const EditIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>✏️</Text>
);

export const UserIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>👤</Text>
);

export const EmailIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>📧</Text>
);

export const AgeIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🎂</Text>
);

export const ClassIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🎓</Text>
);



export const DocumentIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>📄</Text>
);


export const PlayIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>▶️</Text>
);

export const TargetIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🎯</Text>
);

export const ChartIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>📈</Text>
);

export const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>🔍</Text>
);

export const FilterIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>⚙️</Text>
);

export const DownloadIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = '#FFFFFF' 
}) => (
  <Text style={[styles.icon, { fontSize: size, color }]}>📥</Text>
);



const styles = StyleSheet.create({
  icon: {
    fontWeight: 'bold',
  },
});


