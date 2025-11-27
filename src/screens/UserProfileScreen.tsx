import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { User, UserFormData } from '../types/user';
import { getUser, saveUser, deleteUser } from '../database/user.table';
import Button from '../components/Button/Button';
import {
  EditIcon,
  SaveIcon,
  DeleteIcon,
  UserIcon,
  EmailIcon,
  AgeIcon,
  ClassIcon,
} from '../components/Icons';
import { IUser } from '../database/user.table';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import { useTheme } from '../theme/ThemeContext';
const UserProfileScreen: React.FC = () => {
  const [user, setUser] = useState<IUser | User | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    age: 0,
    className: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await getUser();
      setUser(userData);

      if (userData) {
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          age: userData.age || 0,
          className: userData.className || '',
        });
      } else {
        // Initialize with empty strings if no user exists
        setFormData({
          name: '',
          email: '',
          age: 0,
          className: '',
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setSaving(true);
      await saveUser(formData);
      await loadUserProfile();
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving user profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteUser();
      setUser(null);
      setFormData({ name: '', email: '', age: 0, className: '' });
      setShowDeleteModal(false);
      Alert.alert('Success', 'Profile deleted successfully');
    } catch (error) {
      console.error('Error deleting user profile:', error);
      Alert.alert('Error', 'Failed to delete profile');
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age,
        className: user.className || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        age: 0,
        className: '',
      });
    }
    setEditing(false);
  };

  const getInitials = (name: string): string => {
    if (!name.trim()) return '?';

    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const {currentTheme}=useTheme();

  return (
    <ScrollView style={[styles.container,{backgroundColor:currentTheme.colors.background}]} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={[styles.header,{backgroundColor:currentTheme.colors.card}]}>
        <Text style={[styles.title,{color:currentTheme.colors.text}]}>Profile</Text>
        <Text style={[styles.subtitle,{color:currentTheme.colors.textSecondary}]}>
          {user
            ? 'Manage your profile information'
            : 'Create your profile to get started'}
        </Text>
      </View>
      <View style={styles.selectTheme}>
            <Text style={[styles.themetext,{color:currentTheme.colors.text}]}>Theme : </Text>
            <ThemeToggle/>
      </View>
      {/* Profile Card */}
      <View style={[styles.card,{backgroundColor:currentTheme.colors.card}]}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user && formData.name ? (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(formData.name)}
                </Text>
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <UserIcon size={32} color="#9CA3AF" />
              </View>
            )}
          </View>

          {!editing && user && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <EditIcon size={18} color="#407BFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <UserIcon size={18} color="#6B7280" />
              <Text style={[styles.label,{color:currentTheme.colors.text}]}>Full Name</Text>
            </View>
            {editing ? (
              <TextInput
                style={[styles.input,{backgroundColor:currentTheme.colors.inputBackground}]}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, name: text }))
                }
              />
            ) : (
              <Text style={[styles.valueText,{color:currentTheme.colors.info}]}>{user?.name || 'Not set'}</Text>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <EmailIcon size={18} color="#6B7280" />
              <Text style={[styles.label,{color:currentTheme.colors.text}]}>Email Address</Text>
            </View>
            {editing ? (
              <TextInput
                style={[styles.input,{backgroundColor:currentTheme.colors.inputBackground}]}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={[styles.valueText,{color:currentTheme.colors.info}]}>{user?.email || 'Not set'}</Text>
            )}
          </View>

          {/* Age Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <AgeIcon size={18} color="#6B7280" />
              <Text style={[styles.label,{color:currentTheme.colors.text}]}>Age</Text>
            </View>
            {editing ? (
              <TextInput
                style={[styles.input,{backgroundColor:currentTheme.colors.inputBackground}]}
                placeholder="Enter your age"
                placeholderTextColor="#9CA3AF"
                value={String(formData.age)} // FIX
                onChangeText={
                  text => setFormData(prev => ({ ...prev, age: Number(text) })) // convert string → number
                }
                keyboardType="numeric"
              />
            ) : (
              <Text style={[styles.valueText,{color:currentTheme.colors.info}]}>{user?.age || 'Not set'}</Text>
            )}
          </View>

          {/* className Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <ClassIcon size={18} color="#6B7280" />
              <Text style={[styles.label,{color:currentTheme.colors.text}]}>className/Grade</Text>
            </View>
            {editing ? (
              <TextInput
                style={[styles.input,{backgroundColor:currentTheme.colors.inputBackground}]}
                placeholder="e.g., 10th Grade, B.Tech CS, etc."
                placeholderTextColor="#9CA3AF"
                value={formData.className}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, className: text }))
                }
              />
            ) : (
              <Text style={[styles.valueText,{color:currentTheme.colors.info}]}>
                {user?.className || 'Not set'}
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {editing ? (
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancelEdit}
              style={styles.cancelButton}
            />
            <Button
              title="Save Changes"
              variant="primary"
              loading={saving}
              leftIcon={<SaveIcon />}
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        ) : user ? (
          <View style={styles.actionButtons}>
            <Button
              title="Delete Profile"
              variant="error"
              leftIcon={<DeleteIcon />}
              onPress={() => setShowDeleteModal(true)}
              fullWidth
            />
          </View>
        ) : (
          <Button
            title="Create Profile"
            variant="primary"
            leftIcon={<SaveIcon />}
            onPress={() => setEditing(true)}
            fullWidth
          />
        )}
      </View>

      {/* Stats Card */}
      {user && (
        <View style={[styles.statsCard,{backgroundColor:currentTheme.colors.card}]}>
          <Text style={[styles.statsTitle,{color:currentTheme.colors.text}]}>Profile Information</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue,{color:currentTheme.colors.info}]}>{formatDate(user.createdAt)}</Text>
              <Text style={[styles.statLabel,{color:currentTheme.colors.text}]}>Member Since</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue,{color:currentTheme.colors.info}]}>{formatDate(user.updatedAt)}</Text>
              <Text style={[styles.statLabel,{color:currentTheme.colors.text}]}>Last Updated</Text>
            </View>
          </View>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <DeleteIcon size={48} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Delete Profile?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your profile? This action cannot
              be undone and all your data will be lost.
            </Text>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalCancel}
              />
              <Button
                title="Delete Profile"
                variant="error"
                onPress={handleDeleteProfile}
                style={styles.modalDelete}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectTheme:{
    flexDirection:'row',
    justifyContent:'center'
  },
  themetext:{
    alignSelf:'center',
    paddingRight:20,
    fontWeight:500
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#407BFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
  },
  editButtonText: {
    color: '#407BFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  valueText: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 4,
  },
  actionButtons: {
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#407BFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancel: {
    flex: 1,
  },
  modalDelete: {
    flex: 1,
  },
});

export default UserProfileScreen;
