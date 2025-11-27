import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import Button from '../components/Button/Button';
import { SaveIcon, PlusIcon, CloseIcon } from '../components/Icons';
import { addQuestion } from '../database/question.table';
import { Topic } from '../types/topic';

interface QuestionFormData {
  topic_name: string;
  question: string;
  answer: string;
}

interface QuestionFormProps {
  onSubmit: (data: QuestionFormData) => void;
  loading?: boolean;
  initialData?: QuestionFormData;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    topic_name: '',
    question: '',
    answer: '',
  });
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const topics: Topic[] = [
    { id: 1, name: 'General', color: '#407BFF' },
    { id: 2, name: 'Mathematics', color: '#8B5CF6' },
    { id: 3, name: 'Science', color: '#2ECC71' },
    { id: 4, name: 'History', color: '#FF9F43' },
    { id: 5, name: 'Technology', color: '#FF6B6B' },
    { id: 6, name: 'Language', color: '#1ABC9C' },
  ];

  const selectedTopic = topics.find(topic => topic.name === formData.topic_name);

  const handleSubmit = async () => {
    if (!formData.topic_name) {
      Alert.alert('Error', 'Please select a topic');
      return;
    }
    if (!formData.question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }
    if (!formData.answer.trim()) {
      Alert.alert('Error', 'Please enter an answer');
      return;
    }

    setSaving(true);
    try {
      await addQuestion(formData);
      onSubmit(formData);
      
      // Reset form
      setFormData({
        topic_name: '',
        question: '',
        answer: '',
      });
      
      Alert.alert('Success', 'Question saved successfully!');
    } catch (error) {
      console.error('Error saving question:', error);
      Alert.alert('Error', 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setFormData(prev => ({ ...prev, topic_name: topic.name }));
    setShowTopicModal(false);
  };

  return (
    <View style={styles.formContainer}>
      {/* Topic Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Topic</Text>
        <TouchableOpacity
          style={styles.topicSelector}
          onPress={() => setShowTopicModal(true)}
        >
          {selectedTopic ? (
            <View style={styles.selectedTopic}>
              <View 
                style={[
                  styles.topicColor,
                  { backgroundColor: selectedTopic.color }
                ]} 
              />
              <Text style={styles.selectedTopicText}>{selectedTopic.name}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Select a topic</Text>
          )}
          <Text style={styles.selectorArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Question Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Question</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter your question..."
          placeholderTextColor="#9CA3AF"
          value={formData.question}
          onChangeText={(text) => setFormData(prev => ({ ...prev, question: text }))}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Answer Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Answer</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter the answer..."
          placeholderTextColor="#9CA3AF"
          value={formData.answer}
          onChangeText={(text) => setFormData(prev => ({ ...prev, answer: text }))}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Submit Button */}
      <Button
        title="Save Question"
        variant="primary"
        size="large"
        loading={saving || loading}
        leftIcon={<SaveIcon />}
        onPress={handleSubmit}
        fullWidth
        style={styles.submitButton}
      />

      {/* Topic Selection Modal */}
      <Modal
        visible={showTopicModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTopicModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Topic</Text>
              <TouchableOpacity
                onPress={() => setShowTopicModal(false)}
                style={styles.closeButton}
              >
                <CloseIcon color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.topicsList}>
              {topics.map(topic => (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicItem,
                    formData.topic_name === topic.name && styles.selectedTopicItem
                  ]}
                  onPress={() => handleTopicSelect(topic)}
                >
                  <View 
                    style={[
                      styles.topicColor,
                      { backgroundColor: topic.color }
                    ]} 
                  />
                  <Text style={styles.topicName}>{topic.name}</Text>
                  {formData.topic_name === topic.name && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  topicSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
  },
  selectedTopic: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topicColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedTopicText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
  selectorArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  submitButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  topicsList: {
    maxHeight: 400,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedTopicItem: {
    backgroundColor: '#F0F7FF',
  },
  topicName: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#407BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default QuestionForm;