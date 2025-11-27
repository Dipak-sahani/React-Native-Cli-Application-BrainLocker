import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { getAllQuestions, deleteQuestion } from '../database/question.table';
import { EyeIcon, EyeOffIcon, DeleteIcon, BookIcon, SearchIcon, FilterIcon, DownloadIcon, ArrowLeftIcon } from '../components/Icons';
import Button from '../components/Button/Button';
import { useTheme } from '../theme/ThemeContext';

interface Question {
  id: number;
  topic_name: string;
  question: string;
  answer: string;
  createdAt: string;
}

type ScreenMode = 'topics' | 'questions';

const QuestionsListScreen: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [screenMode, setScreenMode] = useState<ScreenMode>('topics');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const {currentTheme}=useTheme();
  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterAndSortQuestions();
  }, [questions, searchQuery, selectedTopic, sortBy]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await getAllQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadQuestions();
  };

  const filterAndSortQuestions = () => {
    let filtered = questions;

    // Filter by selected topic when in questions mode
    if (screenMode === 'questions' && selectedTopic) {
      filtered = filtered.filter(q => q.topic_name === selectedTopic);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredQuestions(filtered);
  };

  const getUniqueTopics = (): string[] => {
    const topics = questions.map(q => q.topic_name);
    return Array.from(new Set(topics)).sort();
  };

  const getTopicStats = (topic: string) => {
    const topicQuestions = questions.filter(q => q.topic_name === topic);
    return {
      total: topicQuestions.length,
      // You can add more stats here like mastered count, etc.
    };
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setScreenMode('questions');
    setSearchQuery(''); // Clear search when switching topics
  };

  const handleBackToTopics = () => {
    setSelectedTopic('');
    setScreenMode('topics');
    setSearchQuery(''); // Clear search when going back
  };

  const toggleAnswer = (questionId: number) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(questionId);
              loadQuestions();
              Alert.alert('Success', 'Question deleted successfully');
            } catch (error) {
              console.error('Error deleting question:', error);
              Alert.alert('Error', 'Failed to delete question');
            }
          },
        },
      ]
    );
  };

  const getTopicColor = (topicName: string): string => {
    const topicColors: { [key: string]: string } = {
      'General': '#407BFF',
      'Mathematics': '#8B5CF6',
      'Science': '#2ECC71',
      'History': '#FF9F43',
      'Technology': '#FF6B6B',
      'Language': '#1ABC9C',
      'Geography': '#9B59B6',
      'Art': '#E74C3C',
      'JavaScript': '#407BFF',
      'Java': '#FF6B6B',
      'Python': '#2ECC71',
      'React': '#61DAFB',
      'CSS': '#264DE4',
      'HTML': '#E34F26',
    };
    return topicColors[topicName] || '#407BFF';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const exportToPDF = async () => {
    const exportQuestions = selectedTopic ? 
      filteredQuestions : // Current topic questions
      questions; // All questions
    
    let pdfContent = `Study Notes Pro - Q&A Export\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    
    if (selectedTopic) {
      pdfContent += `Topic: ${selectedTopic}\n\n`;
    }
    
    exportQuestions.forEach((question, index) => {
      pdfContent += `Question ${index + 1}:\n`;
      pdfContent += `Topic: ${question.topic_name}\n`;
      pdfContent += `Question: ${question.question}\n`;
      pdfContent += `Answer: ${question.answer}\n`;
      pdfContent += `Created: ${formatDate(question.createdAt)}\n`;
      pdfContent += '─'.repeat(50) + '\n\n';
    });

    Alert.alert(
      'PDF Export Ready',
      `Generated PDF with ${exportQuestions.length} questions.\n\nIn a real app, this would download as a PDF file.`,
      [{ text: 'OK' }]
    );
  };

  // Render Topic Item
  const renderTopicItem = ({ item }: { item: string }) => {
    const stats = getTopicStats(item);
    return (
      <TouchableOpacity
        style={[styles.topicCard,{backgroundColor:currentTheme.colors.card}]}
        onPress={() => handleTopicSelect(item)}
      >
        <View style={styles.topicHeader}>
          <View 
            style={[
              styles.topicColor,
              { backgroundColor: getTopicColor(item) }
            ]} 
          />
          <Text style={[styles.topicName,{color:currentTheme.colors.text}]}>{item}</Text>
          <View style={styles.topicArrow}>
            <Text style={[styles.topicArrowText,{color:currentTheme.colors.text}]}>→</Text>
          </View>
        </View>
        <View style={styles.topicStats}>
          <Text style={[styles.topicStatsText,{color:currentTheme.colors.text}]}>
            {stats.total} question{stats.total !== 1 ? 's' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render Question Item
  const renderQuestionItem = ({ item }: { item: Question }) => (
    <View style={[styles.questionCard,{backgroundColor:currentTheme.colors.card}]}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={() => toggleAnswer(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.questionContent}>
          <Text style={[styles.questionText,{color:currentTheme.colors.primaryLight}]}>{item.question}</Text>
          <View style={styles.toggleIcon}>
            {expandedQuestionId === item.id ? (
              <EyeOffIcon size={20} color="#6B7280" />
            ) : (
              <EyeIcon size={20} color="#6B7280" />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Answer (Expandable) */}
      {expandedQuestionId === item.id && (
        <View style={styles.answerContainer}>
          <View style={styles.answerDivider} />
          <Text style={[styles.answerLabel,{color:currentTheme.colors.text}]}>Answer:</Text>
          <Text style={[styles.answerText,{color:currentTheme.colors.textSecondary}]}>{item.answer}</Text>
          
          {/* Date and Delete */}
          <View style={styles.questionFooter}>
            <Text style={styles.dateText}>
              Created: {formatDate(item.createdAt)}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteQuestion(item.id)}
            >
              <DeleteIcon size={18} color="#ff1100ff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  // Topics List Header
  const renderTopicsHeader = () => (
    <View style={[styles.header,{backgroundColor:currentTheme.colors.header}]}>
      <Text style={[styles.title,{color:currentTheme.colors.text}]}>My Study Topics</Text>
      <Text style={[styles.subtitle,{color:currentTheme.colors.textSecondary}]}>
        {getUniqueTopics().length} topics • {questions.length} total questions
      </Text>

      {/* Search Bar */}
      <View style={[styles.searchContainer]}>
        <View style={[styles.searchInputContainer,{backgroundColor:currentTheme.colors.inputBackground}]}>
          <SearchIcon size={20} color="#6B7280" />
          <TextInput
            style={[styles.searchInput,{backgroundColor:currentTheme.colors.inputBackground}]}
            placeholder="Search topics..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );

  // Questions List Header
  const renderQuestionsHeader = () => (
    <View style={[styles.header,{backgroundColor:currentTheme.colors.header}]}>
      <View style={styles.questionsHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToTopics}
        >
          <ArrowLeftIcon size={20} color="#407BFF" />
          <Text style={styles.backButtonText}>All Topics</Text>
        </TouchableOpacity>
        
        <View style={styles.topicHeaderInfo}>
          <View 
            style={[
              styles.selectedTopicBadge,
              { backgroundColor: getTopicColor(selectedTopic) }
            ]}
          >
            <Text style={styles.selectedTopicText}>{selectedTopic}</Text>
          </View>
          <Text style={styles.questionsCount}>
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer,{backgroundColor:currentTheme.colors.inputBackground}]}>
          <SearchIcon size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search in ${selectedTopic}...`}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );

  // Empty States
  const renderEmptyTopics = () => (
    <View style={styles.emptyState}>
      <BookIcon size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No Topics Yet</Text>
      <Text style={styles.emptyText}>
        Create your first question to get started! Questions will be automatically organized by topic.
      </Text>
    </View>
  );

  const renderEmptyQuestions = () => (
    <View style={styles.emptyState}>
      <BookIcon size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No Questions in {selectedTopic}</Text>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'No questions found matching your search'
          : 'Start adding questions to this topic'
        }
      </Text>
      {searchQuery && (
        <Button
          title="Clear Search"
          variant="primary"
          onPress={() => setSearchQuery('')}
          style={styles.emptyStateButton}
        />
      )}
    </View>
  );

  if (loading && questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container,{backgroundColor:currentTheme.colors.background}]}>
      {screenMode === 'topics' ? (
        <FlatList
          data={getUniqueTopics().filter(topic => 
            topic.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderTopicItem}
          keyExtractor={(item) => item}
          ListHeaderComponent={renderTopicsHeader}
          ListEmptyComponent={renderEmptyTopics}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#407BFF']}
              tintColor="#407BFF"
            />
          }
          
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <FlatList
          data={filteredQuestions}
          renderItem={renderQuestionItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderQuestionsHeader}
          ListEmptyComponent={renderEmptyQuestions}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#407BFF']}
              tintColor="#407BFF"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      {/* Export Button - Show only when there are questions */}
      {(filteredQuestions.length > 0 || (screenMode === 'topics' && questions.length > 0)) && (
        <View style={styles.exportContainer}>
          <Button
            title={`Export ${selectedTopic ? filteredQuestions.length : questions.length} Questions as PDF`}
            variant="outline"
            leftIcon={<DownloadIcon color="#407BFF" />}
            onPress={exportToPDF}
            fullWidth
            size="small"
          />
        </View>
      )}
    </View>
  );
};

// Add ArrowLeftIcon to your Icons
// const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ 
//   size = 20, 
//   color = '#FFFFFF' 
// }) => (
//   <Text style={[{ fontSize: size, color }]}>←</Text>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
    marginBottom:20
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
  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  backButtonText: {
    color: '#407BFF',
    fontSize: 16,
    fontWeight: '600',
  },
  topicHeaderInfo: {
    alignItems: 'flex-end',
  },
  selectedTopicBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  selectedTopicText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  questionsCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  clearText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  // Topic Card Styles
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  topicName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  topicArrow: {
    padding: 4,
  },
  topicArrowText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  topicStats: {
    marginLeft: 32,
  },
  topicStatsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Question Card Styles
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  questionContainer: {
    marginBottom: 8,
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    lineHeight: 22,
  },
  toggleIcon: {
    marginLeft: 12,
    padding: 4,
  },
  answerContainer: {
    marginTop: 8,
  },
  answerDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 4,
  },
  // Empty States
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyStateButton: {
    marginTop: 16,
  },
  exportContainer: {
    padding: 16,
    paddingBottom: 8,
  },
});

export default QuestionsListScreen;