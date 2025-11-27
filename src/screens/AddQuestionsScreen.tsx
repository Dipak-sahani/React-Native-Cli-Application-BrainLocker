import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Button from '../components/Button/Button';
import { PlusIcon, DocumentIcon, BookIcon } from '../components/Icons';
import QuestionForm from '../components/QuestionForm';
import BulkImportScreen from './BulkImportScreen';
import { useTheme } from '../theme/ThemeContext';

type ActiveSection = 'single' | 'bulk';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AddQuestionsScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('single');
  const [slideAnim] = useState(new Animated.Value(0));

  const handleSectionChange = (section: ActiveSection) => {
    Animated.timing(slideAnim, {
      toValue: section === 'single' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setActiveSection(section);
  };

  const handleImportComplete = () => {
    console.log('Import completed');
  };

  const getTransform = () => {
    return {
      transform: [
        {
          translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -SCREEN_WIDTH],
          }),
        },
      ],
    };
  };

  const {currentTheme} = useTheme();

  return (
    <View style={[styles.container,{backgroundColor:currentTheme.colors.background}]}>
      {/* Header */}
      <View style={[styles.header,{backgroundColor:currentTheme.colors.header}]}>
        <Text style={[styles.title,{color:currentTheme.colors.text}]}>Add Questions</Text>
        <Text style={[styles.subtitle,{color:currentTheme.colors.textSecondary}]}>
          Choose how you want to add questions and answers
        </Text>
      </View>

      {/* Section Selector */}
      <View style={[styles.selectorContainer]}>
        <View style={[styles.selectorBackground,{backgroundColor:currentTheme.colors.card}]}>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              activeSection === 'single' && styles.selectorButtonActive,
              
            ]}
            onPress={() => handleSectionChange('single')}
          >
            <PlusIcon 
              size={20} 
              color={activeSection === 'single' ? '#078510ff' : '#054f0aff'} 
            />
            <Text
              style={[
                styles.selectorText,
                activeSection === 'single' && styles.selectorTextActive,
                
              ]}
            >
              Single Q&A
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.selectorButton,
              activeSection === 'bulk' && styles.selectorButtonActive,
            ]}
            onPress={() => handleSectionChange('bulk')}
          >
            <DocumentIcon 
              size={20} 
              color={activeSection === 'bulk' ? '#ffffffff' : '#6B7280'} 
            />
            <Text
              style={[
                styles.selectorText,
                activeSection === 'bulk' && styles.selectorTextActive,
              ]}
            >
              Bulk Import
            </Text>
          </TouchableOpacity>

          {/* Active Indicator */}
          <View
            style={[
              styles.activeIndicator,
              activeSection === 'bulk' && styles.activeIndicatorRight,
            ]}
          />
        </View>
      </View>

      {/* Content Area - FIXED LAYOUT */}
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.sliderContainer, getTransform()]}>
          {/* Single Question Section */}
          <View style={styles.section}>
            <View style={styles.sectionContent}>
              <View style={styles.sectionHeader}>
                <BookIcon size={24} color="#407BFF" />
                <Text style={[styles.sectionTitle,{color:currentTheme.colors.text}]}>Add Single Question</Text>
              </View>
              <Text style={[styles.sectionDescription,{color:currentTheme.colors.textSecondary}]}>
                Perfect for adding one question at a time with detailed answers.
              </Text>
              
              {/* Single Question Form - Remove extra padding */}
              <View style={[styles.formContainer]}>
                <QuestionForm
                  onSubmit={(data) => {
                    console.log('Single question submitted:', data);
                  }}
                />
              </View>
            </View>
          </View>

          {/* Bulk Import Section */}
          <View style={styles.section}>
            <View style={styles.sectionContent}>
              <View style={styles.sectionHeader}>
                <DocumentIcon size={24} color="#8B5CF6" />
                <Text style={[styles.sectionTitle,{color:currentTheme.colors.text}]}>Bulk Import</Text>
              </View>
              <Text style={[styles.sectionDescription,{color:currentTheme.colors.textSecondary}]}>
                Import multiple questions at once using Q&A format.
              </Text>
              
              {/* Bulk Import - Remove extra padding */}
              <View style={styles.formContainer}>
                <BulkImportScreen onImportComplete={handleImportComplete} />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
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
  selectorContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  selectorBackground: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    position: 'relative',
  },
  selectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    zIndex: 2,
  },
  selectorButtonActive: {
    // Background handled by active indicator
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectorTextActive: {
    color: '#407BFF',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '50%',
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  activeIndicatorRight: {
    transform: [{ translateX: '100%' }],
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2, // Use actual screen width
  },
  section: {
    width: SCREEN_WIDTH, // Each section takes full screen width
    height: '100%',
  },
  sectionContent: {
    flex: 1,
    paddingHorizontal: 8, // Reduced horizontal padding
    paddingTop: 8, // Reduced top padding
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure no background color
  },
});

export default AddQuestionsScreen;