import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import Button from '../components/Button/Button';
import {
  SaveIcon,
  PlusIcon,
  CloseIcon,
  BookIcon,
  CheckIcon,
  SearchIcon,
} from '../components/Icons';
import { addQuestion, AddQue } from '../database/question.table';
import { Topic } from '../types/topic';
import { useTheme } from '../theme/ThemeContext';

interface ParsedQuestion {
  question: string;
  answer: string;
  valid: boolean;
  error?: string;
}

interface BulkImportScreenProps {
  onImportComplete: () => void;
  compact?: boolean;
}

const BulkImportScreen: React.FC<BulkImportScreenProps> = ({
  onImportComplete,
  compact = false,
}) => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [showCustomTopic, setShowCustomTopic] = useState(false);
  const [inputText, setInputText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
  }>({ success: 0, failed: 0 });
  const [showResults, setShowResults] = useState(false);

  const topics: Topic[] = [
    { id: 1, name: 'General', color: '#407BFF' },
    { id: 2, name: 'Mathematics', color: '#8B5CF6' },
    { id: 3, name: 'Science', color: '#2ECC71' },
    { id: 4, name: 'History', color: '#FF9F43' },
    { id: 5, name: 'Technology', color: '#FF6B6B' },
    { id: 6, name: 'Language', color: '#1ABC9C' },
    { id: 7, name: 'Geography', color: '#9B59B6' },
    { id: 8, name: 'Art', color: '#E74C3C' },
    { id: 9, name: 'JavaScript', color: '#407BFF' },
    { id: 10, name: 'React Native', color: '#8B5CF6' },
  ];

  const parseQuestions = (text: string): ParsedQuestion[] => {
    if (!text.trim()) return [];

    const lines = text.split('\n');
    const questions: ParsedQuestion[] = [];
    let currentQuestion = '';
    let currentAnswer = '';
    let isReadingQuestion = false;
    let isReadingAnswer = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      if (/^(Q\d*:|Question\d*:|\d+\.\s)/i.test(line)) {
        if (currentQuestion && currentAnswer) {
          questions.push({
            question: currentQuestion.trim(),
            answer: currentAnswer.trim(),
            valid: true,
          });
        } else if (currentQuestion && !currentAnswer) {
          questions.push({
            question: currentQuestion.trim(),
            answer: '',
            valid: false,
            error: 'Missing answer',
          });
        }

        currentQuestion = line
          .replace(/^(Q\d*:|Question\d*:|\d+\.\s)\s*/i, '')
          .trim();
        currentAnswer = '';
        isReadingQuestion = true;
        isReadingAnswer = false;
      } else if (/^(A\d*:|Answer\d*:)/i.test(line)) {
        currentAnswer = line.replace(/^(A\d*:|Answer\d*:)\s*/i, '').trim();
        isReadingQuestion = false;
        isReadingAnswer = true;
      } else if (isReadingQuestion) {
        currentQuestion += ' ' + line;
      } else if (isReadingAnswer) {
        currentAnswer += ' ' + line;
      } else if (!currentQuestion && line.length > 0) {
        currentQuestion = line;
        isReadingQuestion = true;
      }
    }

    if (currentQuestion) {
      questions.push({
        question: currentQuestion.trim(),
        answer: currentAnswer.trim(),
        valid: currentAnswer.trim().length > 0,
        error: currentAnswer.trim().length === 0 ? 'Missing answer' : undefined,
      });
    }

    return questions;
  };

  const handlePreview = () => {
    const finalTopic = showCustomTopic ? customTopic.trim() : topic;

    if (!finalTopic) {
      Alert.alert('Error', 'Please select or enter a topic name');
      return;
    }

    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some questions and answers');
      return;
    }

    const parsed = parseQuestions(inputText);

    if (parsed.length === 0) {
      Alert.alert(
        'No Questions Found',
        'Could not detect any questions in the provided text. Please check the format.',
      );
      return;
    }

    setParsedQuestions(parsed);
    setShowPreview(true);
  };

  const handleImport = async () => {
    const finalTopic = showCustomTopic ? customTopic.trim() : topic;

    if (!finalTopic) {
      Alert.alert('Error', 'Please select or enter a topic name');
      return;
    }

    const validQuestions = parsedQuestions.filter(q => q.valid);

    if (validQuestions.length === 0) {
      Alert.alert('Error', 'No valid questions to import');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failedCount = 0;

    try {
      for (const question of validQuestions) {
        try {
          const AddQue: AddQue = {
            topic_name: finalTopic,
            question: question.question,
            answer: question.answer,
          };

          await addQuestion(AddQue);
          successCount++;
        } catch (error) {
          console.error('Error importing question:', error);
          failedCount++;
        }
      }

      setImportResults({ success: successCount, failed: failedCount });
      setShowResults(true);

      if (successCount > 0) {
        setInputText('');
        setParsedQuestions([]);
        setTopic('');
        setCustomTopic('');
        setShowCustomTopic(false);
      }
    } catch (error) {
      console.error('Error during import:', error);
      Alert.alert('Error', 'Failed to import questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomTopic = () => {
    if (!customTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic name');
      return;
    }
    setShowCustomTopic(false);
    setTopic(customTopic);
  };

  const getSampleText = () => {
    return `Q1: What is JavaScript?
A1: JavaScript is a versatile, object-oriented scripting language used to create dynamic and interactive content on websites.

Q2: What are the data types in JavaScript?
A2: Primitive data types: String, Number, Boolean, Undefined, Null, BigInt, Symbol. Non-primitive: Object.

Q3: What is the difference between let, const, and var?
A3: var is function-scoped and can be redeclared. let is block-scoped and cannot be redeclared. const is block-scoped and cannot be reassigned.

Q4: Explain closures in JavaScript.
A4: A closure is a function that has access to its own scope, the outer function's scope, and the global scope.`;
  };

  const handleUseSample = () => {
    setInputText(getSampleText());
  };

  const handleCloseResults = () => {
    setShowResults(false);
    if (importResults.success > 0) {
      onImportComplete();
    }
  };

  const finalTopic = showCustomTopic ? customTopic : topic;

  const { currentTheme } = useTheme();

  return (
    <View
      style={[
        compact ? styles.compactContainer : styles.container,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          compact ? styles.compactScrollContent : styles.scrollContent
        }
      >
        <View
          style={[
            compact ? styles.compactCard : styles.card,
            { backgroundColor: currentTheme.colors.card },
          ]}
        >
          {/* Topic Selection Section - NEW */}
          {/* Topic Selection Section - FIXED LAYOUT */}
          <View style={styles.topicSection}>
            <Text
              style={[styles.sectionLabel, { color: currentTheme.colors.text }]}
            >
              Topic *
            </Text>

            {!showCustomTopic ? (
              <>
                <Text
                  style={[
                    styles.topicDescription,
                    { color: currentTheme.colors.textSecondary },
                  ]}
                >
                  Select an existing topic or create a new one
                </Text>

                {/* Existing Topics - Fixed Height Container */}
                <View style={styles.topicsContainerWrapper}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.topicsScroll}
                    contentContainerStyle={styles.topicsContent}
                  >
                    {topics.map(topicItem => (
                      <TouchableOpacity
                        key={topicItem.id}
                        style={[
                          styles.topicChip,
                          topic === topicItem.name && styles.selectedTopicChip,
                          { backgroundColor: topicItem.color },
                        ]}
                        onPress={() => setTopic(topicItem.name)}
                      >
                        <Text
                          style={[
                            styles.topicChipText,
                            topic === topicItem.name &&
                              styles.selectedTopicChipText,
                          ]}
                        >
                          {topicItem.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Custom Topic Button - Moved outside scroll view */}
                <Button
                  title="Create New Topic"
                  variant="ghost"
                  size="small"
                  leftIcon={<PlusIcon size={16} color="#407BFF" />}
                  onPress={() => setShowCustomTopic(true)}
                  fullWidth={false}
                  style={styles.customTopicButton}
                />

                {/* Selected Topic Display */}
                {topic && (
                  <View style={styles.selectedTopicDisplay}>
                    <Text style={styles.selectedTopicLabel}>
                      Selected Topic:
                    </Text>
                    <View style={styles.selectedTopicBadge}>
                      <View
                        style={[
                          styles.topicColorDot,
                          {
                            backgroundColor:
                              topics.find(t => t.name === topic)?.color ||
                              '#407BFF',
                          },
                        ]}
                      />
                      <Text style={styles.selectedTopicText}>{topic}</Text>
                    </View>
                  </View>
                )}
              </>
            ) : (
              /* Custom Topic Input */
              <View style={[styles.customTopicContainer,{backgroundColor:currentTheme.colors.inputBackground}]}>
                <Text style={styles.customTopicLabel}>New Topic Name</Text>
                <TextInput
                  style={[styles.customTopicInput,{backgroundColor:currentTheme.colors.inputBackground}]}
                  placeholder="Enter topic name..."
                  placeholderTextColor="#9CA3AF"
                  value={customTopic}
                  onChangeText={setCustomTopic}
                  autoFocus
                />
                <View style={styles.customTopicActions}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setShowCustomTopic(false);
                      setCustomTopic('');
                    }}
                    style={styles.customTopicCancel}
                  />
                  <Button
                    title="Add Topic"
                    variant="primary"
                    onPress={handleAddCustomTopic}
                    style={styles.customTopicAdd}
                  />
                </View>
              </View>
            )}
          </View>
          {/* Text Input Area */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={[styles.label,{color:currentTheme.colors.text}]}>Questions & Answers</Text>
              <TouchableOpacity
                onPress={handleUseSample}
                style={styles.sampleButton}
              >
                <Text style={styles.sampleButtonText}>Use Sample</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.textArea,{backgroundColor:currentTheme.colors.inputBackground}]}
              placeholder={`Paste your questions and answers here...\n\nExample format:\nQ1: What is JavaScript?\nA1: JavaScript is a programming language...\n\nQ2: What are variables?\nA2: Variables store data values...`}
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={12}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {inputText.length} characters • {parseQuestions(inputText).length}{' '}
              questions detected
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Preview Questions"
              variant="outline"
              onPress={handlePreview}
              disabled={!inputText.trim() || !finalTopic}
              fullWidth
              style={styles.previewButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Preview ({parsedQuestions.length} questions)
              </Text>
              <Text style={styles.modalSubtitle}>Topic: {finalTopic}</Text>
              <TouchableOpacity
                onPress={() => setShowPreview(false)}
                style={styles.closeButton}
              >
                <CloseIcon color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.previewList}>
              {parsedQuestions.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.previewItem,
                    !item.valid && styles.invalidItem,
                  ]}
                >
                  <View style={styles.previewHeader}>
                    <View style={styles.questionNumber}>
                      <Text style={styles.numberText}>#{index + 1}</Text>
                    </View>
                    {item.valid ? (
                      <CheckIcon size={16} color="#2ECC71" />
                    ) : (
                      <Text style={styles.errorIcon}>⚠️</Text>
                    )}
                  </View>

                  <Text style={styles.previewQuestion}>
                    {item.question || 'No question detected'}
                  </Text>

                  {item.answer ? (
                    <Text style={styles.previewAnswer}>{item.answer}</Text>
                  ) : (
                    <Text style={styles.missingAnswer}>Missing answer</Text>
                  )}

                  {item.error && (
                    <Text style={styles.errorText}>{item.error}</Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowPreview(false)}
                style={styles.modalButton}
              />
              <Button
                title={`Import ${
                  parsedQuestions.filter(q => q.valid).length
                } Questions`}
                variant="primary"
                loading={loading}
                leftIcon={<SaveIcon />}
                onPress={handleImport}
                disabled={parsedQuestions.filter(q => q.valid).length === 0}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Results Modal */}
      <Modal
        visible={showResults}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseResults}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.resultsIcon}>
              <BookIcon size={48} color="#407BFF" />
            </View>
            <Text style={styles.modalTitle}>Import Complete!</Text>

            <View style={styles.resultsStats}>
              <View style={styles.resultItem}>
                <Text style={styles.resultCountSuccess}>
                  {importResults.success}
                </Text>
                <Text style={styles.resultLabel}>Successfully imported</Text>
              </View>
              {importResults.failed > 0 && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultCountFailed}>
                    {importResults.failed}
                  </Text>
                  <Text style={styles.resultLabel}>Failed to import</Text>
                </View>
              )}
            </View>

            <Text style={styles.resultsTopic}>
              Topic: <Text style={styles.resultsTopicName}>{finalTopic}</Text>
            </Text>

            <Button
              title="Done"
              variant="primary"
              onPress={handleCloseResults}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  compactContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  compactScrollContent: {
    flexGrow: 1,
    padding: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topicsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  // Rest of the styles remain the same as before
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  sampleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
  },
  sampleButtonText: {
    color: '#407BFF',
    fontSize: 12,
    fontWeight: '600',
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
  textArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'right',
  },
  actionButtons: {
    gap: 12,
  },
  previewButton: {
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    padding: 4,
  },
  previewList: {
    maxHeight: 400,
    padding: 16,
  },
  previewItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  invalidItem: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    backgroundColor: '#407BFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorIcon: {
    fontSize: 16,
  },
  previewQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  previewAnswer: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  missingAnswer: {
    fontSize: 13,
    color: '#EF4444',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  modalButton: {
    flex: 1,
  },
  resultsIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    width: '100%',
  },
  resultItem: {
    alignItems: 'center',
  },
  resultCountSuccess: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2ECC71',
    marginBottom: 4,
  },
  resultCountFailed: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultsTopic: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  resultsTopicName: {
    fontWeight: '600',
    color: '#407BFF',
  },
  topicSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  topicsContainerWrapper: {
    maxHeight: 120, // Fixed height to prevent taking too much space
    marginBottom: 12,
  },
  topicsScroll: {
    flex: 1,
  },
  topicsContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTopicChip: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  topicChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedTopicChipText: {
    fontWeight: '700',
  },
  customTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  customTopicButtonText: {
    color: '#407BFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTopicDisplay: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#407BFF',
  },
  selectedTopicLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  selectedTopicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topicColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  selectedTopicText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  customTopicContainer: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  customTopicLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  customTopicInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  customTopicActions: {
    flexDirection: 'row',
    gap: 12,
  },
  customTopicCancel: {
    flex: 1,
  },
  customTopicAdd: {
    flex: 1,
  },
});

export default BulkImportScreen;
