import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Button from '../components/Button/Button';
import { 
  BookIcon, 
  PlusIcon, 
  DocumentIcon, 
  UserIcon, 
  CheckIcon,
  PlayIcon,
  TargetIcon
} from '../components/Icons';
import { useTheme } from '../theme/ThemeContext';







interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const features = [
    {
      icon: <PlusIcon size={32} color="#407BFF" />,
      title: 'Single Q&A',
      description: 'Add individual questions with detailed answers. Perfect for specific topics.',
      color: '#407BFF',
    },
    {
      icon: <DocumentIcon size={32} color="#8B5CF6" />,
      title: 'Bulk Import',
      description: 'Import multiple questions at once using Q&A format. Great for study materials.',
      color: '#8B5CF6',
    },
    {
      icon: <BookIcon size={32} color="#2ECC71" />,
      title: 'Organized Notes',
      description: 'Categorize your questions by topics and subjects for better organization.',
      color: '#2ECC71',
    },
    {
      icon: <PlayIcon size={32} color="#FF9F43" />,
      title: 'Interactive Learning',
      description: 'Tap to reveal answers and test your knowledge with hidden solutions.',
      color: '#FF9F43',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Add Questions',
      description: 'Create individual Q&A or import multiple at once',
      icon: '📝',
    },
    {
      step: '2',
      title: 'Organize by Topics',
      description: 'Categorize your questions for easy access',
      icon: '📚',
    },
    {
      step: '3',
      title: 'Study & Review',
      description: 'Tap questions to reveal answers and test yourself',
      icon: '🎯',
    },
    {
      step: '4',
      title: 'Track Progress',
      description: 'Monitor your learning journey and improvements',
      icon: '📈',
    },
  ];

  const quickActions = [
    {
      title: 'Add Single Question',
      description: 'Create a new Q&A',
      icon: <PlusIcon size={24} color="#FFFFFF" />,
      color: '#407BFF',
      onPress: () => navigation.navigate('AddQuestion', { section: 'single' }),
    },
    {
      title: 'Bulk Import',
      description: 'Import multiple Q&A',
      icon: <DocumentIcon size={24} color="#FFFFFF" />,
      color: '#8B5CF6',
      onPress: () => navigation.navigate('AddQuestion', { section: 'bulk' }),
    },
    {
      title: 'View My Notes',
      description: 'Browse all questions',
      icon: <BookIcon size={24} color="#FFFFFF" />,
      color: '#2ECC71',
      onPress: () => navigation.navigate('AllQuestions'),
    },
  ];


  const { currentTheme } = useTheme();


  return (
    <ScrollView style={[styles.container,{backgroundColor:currentTheme.colors.background}]} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={[styles.heroSection,{backgroundColor:currentTheme.colors.header}]}>
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            {/* <BookIcon size={48} color="#407BFF" /> */}
            <Image
            
            source={require("../assets/images/logo.png")}
      style={{ width: 120, height: 120 }}
            />
          </View>
          <Text style={[styles.heroTitle,{color:currentTheme.colors.text}]}>BrainLocker</Text>
          <Text style={[styles.heroSubtitle,{color:currentTheme.colors.text}]}>
            Your intelligent companion for effective learning and knowledge retention
          </Text>
          <View style={[styles.heroStats,{backgroundColor:currentTheme.colors.card}]}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={[styles.statLabel,{color:currentTheme.colors.textSecondary}]}>Questions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={[styles.statLabel,{color:currentTheme.colors.textSecondary}]}>Success Rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={[styles.statLabel,{color:currentTheme.colors.textSecondary}]}>Available</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={[styles.section]}>
        <Text style={[styles.sectionTitle,{color:currentTheme.colors.text}]}>Quick Actions</Text>
        <Text style={[styles.sectionSubtitle,{color:currentTheme.colors.textSecondary}]}>
          Get started with these quick actions
        </Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <View style={styles.actionIcon}>
                {action.icon}
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle,{color:currentTheme.colors.text}]}>How It Works</Text>
        <Text style={[styles.sectionSubtitle,{color:currentTheme.colors.textSecondary}]}>
          Simple steps to effective learning
        </Text>
        <View style={[styles.stepsContainer]}>
          {steps.map((step, index) => (
            <View key={index} style={[styles.stepCard,,{backgroundColor:currentTheme.colors.card}]}>
              <View style={[styles.stepHeader]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>
              <Text style={[styles.stepTitle,,{color:currentTheme.colors.text}]}>{step.title}</Text>
              <Text style={[styles.stepDescription,,{color:currentTheme.colors.textSecondary}]}>{step.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle,,{color:currentTheme.colors.text}]}>Key Features</Text>
        <Text style={[styles.sectionSubtitle,{color:currentTheme.colors.textSecondary}]}>
          Everything you need for effective studying
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={[styles.featureCard,,{backgroundColor:currentTheme.colors.card}]}>
              <View style={styles.featureIconContainer}>
                {feature.icon}
              </View>
              <Text style={[styles.featureTitle,,{color:currentTheme.colors.text}]}>{feature.title}</Text>
              <Text style={[styles.featureDescription,,{color:currentTheme.colors.textSecondary}]}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <View style={[styles.benefitsCard,,{backgroundColor:currentTheme.colors.card}]}>
          <Text style={[styles.benefitsTitle,,{color:currentTheme.colors.text}]}>Why Choose Study Notes Pro?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <CheckIcon size={20} color="#2ECC71" />
              <Text style={[styles.benefitText,{color:currentTheme.colors.textSecondary}]}>Organized learning materials</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckIcon size={20} color="#2ECC71" />
              <Text style={[styles.benefitText,{color:currentTheme.colors.textSecondary}]}>Quick knowledge retrieval</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckIcon size={20} color="#2ECC71" />
              <Text style={[styles.benefitText,{color:currentTheme.colors.textSecondary}]}>Interactive study sessions</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckIcon size={20} color="#2ECC71" />
              <Text style={[styles.benefitText,{color:currentTheme.colors.textSecondary}]}>Progress tracking</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckIcon size={20} color="#2ECC71" />
              <Text style={[styles.benefitText,{color:currentTheme.colors.textSecondary}]}>Offline access</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckIcon size={20} color="#2ECC71" />
              <Text style={[styles.benefitText,{color:currentTheme.colors.textSecondary}]}>Customizable topics</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <View style={[styles.ctaCard,{backgroundColor:currentTheme.colors.card}]}>
          <TargetIcon size={48} color="#407BFF" />
          <Text style={[styles.ctaTitle,,{color:currentTheme.colors.text}]}>Ready to Boost Your Learning?</Text>
          <Text style={[styles.ctaDescription,{color:currentTheme.colors.textSecondary}]}>
            Start creating your personalized study notes today and transform how you learn!
          </Text>
          <Button
            title="Get Started Now"
            variant="primary"
            size="large"
            onPress={() => navigation.navigate('AddQuestion')}
            fullWidth
            style={styles.ctaButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F5F7FB',

  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 32,
    paddingTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    // color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#407BFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '48%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#407BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepIcon: {
    fontSize: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  ctaSection: {
    padding: 24,
    paddingBottom: 48,
  },
  ctaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaButton: {
    marginTop: 8,
  },
});

export default HomeScreen;