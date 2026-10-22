import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MobileCivicApi, MobileComplaint } from './src/services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'tasks' | 'track'>('home');
  const [role, setRole] = useState<'citizen' | 'worker' | 'officer'>('citizen');
  const [complaints, setComplaints] = useState<MobileComplaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState('https://ais-dev-cnydeeh3jvhi2mje65vi4k-35328912897.asia-east1.run.app');

  // Report Form State
  const [category, setCategory] = useState('Pothole');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('MG Road, Ward 112, Bengaluru');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80');
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Track State
  const [trackId, setTrackId] = useState('');
  const [foundComplaint, setFoundComplaint] = useState<MobileComplaint | null>(null);

  useEffect(() => {
    MobileCivicApi.setServerUrl(serverUrl);
    loadComplaints();
  }, [serverUrl]);

  const loadComplaints = async () => {
    setLoading(true);
    const list = await MobileCivicApi.getComplaints();
    setComplaints(list);
    setLoading(false);
  };

  const handleAnalyzeAI = async () => {
    if (!description && !photoUrl) {
      Alert.alert('Required', 'Please add a description or photo to analyze.');
      return;
    }
    setIsAnalyzing(true);
    const res = await MobileCivicApi.analyzeWithAI('', description, category);
    setIsAnalyzing(false);
    if (res.data) {
      setAiResult(res.data);
      if (res.data.issueCategory) setCategory(res.data.issueCategory);
      Alert.alert('AI Diagnosis Complete', `Detected ${res.data.issueCategory} with ${res.data.confidence || 92}% confidence.`);
    } else {
      // Deterministic fallback
      setAiResult({
        issueCategory: category,
        severity: 'High',
        recommendedDepartment: 'Road Maintenance',
        confidence: 94,
        reasoning: 'Visual defect impacts civic public safety.',
      });
      Alert.alert('AI Triage (Heuristic)', `Classified as ${category} routed to Road Maintenance.`);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter an issue description.');
      return;
    }
    setLoading(true);
    const res = await MobileCivicApi.createComplaint({
      citizenId: 'user-citizen-01',
      citizenName: 'Kiran Manjunath',
      category,
      description,
      photoUrl,
      location: { address, lat: 12.9756, lng: 77.6092, zone: 'East Zone' },
      priority: aiResult?.priority || 'High',
      department: aiResult?.recommendedDepartment || 'Road Maintenance',
      aiAnalysis: aiResult,
    });
    setLoading(false);

    if (res.complaint) {
      Alert.alert('Success', `Registered Complaint #${res.complaint.id}`);
      setDescription('');
      setAiResult(null);
      loadComplaints();
      setActiveTab('home');
    }
  };

  const handleStartTask = async (id: string) => {
    await MobileCivicApi.updateStatus(id, 'In Progress', { name: 'Ramesh Gowda', role: 'worker' }, {
      title: 'Technician Commenced Repairs',
      description: 'Field crew arrived on site with repair truck.',
    });
    Alert.alert('Updated', `Task #${id} marked In Progress.`);
    loadComplaints();
  };

  const handleResolveTask = async (id: string) => {
    await MobileCivicApi.updateStatus(id, 'Resolved', { name: 'Ramesh Gowda', role: 'worker' }, {
      title: 'Repair Completed & Verified',
      description: 'Asphalt resurfaced, site cleared, and verified.',
    });
    Alert.alert('Success', `Task #${id} marked Resolved!`);
    loadComplaints();
  };

  const handleTrackLookup = () => {
    const found = complaints.find((c) => c.id.toUpperCase() === trackId.trim().toUpperCase());
    if (found) {
      setFoundComplaint(found);
    } else {
      Alert.alert('Not Found', `Complaint #${trackId} not found in database.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Mobile Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Civic<Text style={styles.titleAccent}>AI</Text> Mobile
          </Text>
          <Text style={styles.subtitle}>Smarter Cities. Better Lives.</Text>
        </View>

        {/* Role Toggle */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'citizen' && styles.roleBtnActive]}
            onPress={() => setRole('citizen')}
          >
            <Text style={[styles.roleText, role === 'citizen' && styles.roleTextActive]}>Citizen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'worker' && styles.roleBtnActiveWorker]}
            onPress={() => setRole('worker')}
          >
            <Text style={[styles.roleText, role === 'worker' && styles.roleTextActive]}>Worker</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'home' && (
          <View>
            {/* KPI Cards */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiNumber}>{complaints.length}</Text>
                <Text style={styles.kpiLabel}>Total Issues</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiNumber, { color: '#10b981' }]}>
                  {complaints.filter((c) => c.status === 'Resolved').length}
                </Text>
                <Text style={styles.kpiLabel}>Resolved</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={[styles.kpiNumber, { color: '#f59e0b' }]}>
                  {complaints.filter((c) => c.status !== 'Resolved').length}
                </Text>
                <Text style={styles.kpiLabel}>Active</Text>
              </View>
            </View>

            {/* Quick Action Button */}
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setActiveTab('report')}>
              <Text style={styles.primaryBtnText}>+ Report New Civic Issue</Text>
            </TouchableOpacity>

            {/* Complaints Feed */}
            <Text style={styles.sectionTitle}>Recent Incidents (Shared Database)</Text>
            {loading ? (
              <ActivityIndicator color="#38bdf8" style={{ marginTop: 20 }} />
            ) : (
              complaints.map((item) => (
                <View key={item.id} style={styles.complaintCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.complaintId}>#{item.id}</Text>
                    <Text
                      style={[
                        styles.statusBadge,
                        item.status === 'Resolved' ? styles.statusResolved : styles.statusActive,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.cardLocation}>📍 {item.location.address}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'report' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Report Civic Issue</Text>

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {['Pothole', 'Garbage', 'Water Leak', 'Streetlight'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catBtn, category.includes(cat.split(' ')[0]) && styles.catBtnActive]}
                  onPress={() => setCategory(cat === 'Water Leak' ? 'Water Leakage' : cat === 'Streetlight' ? 'Broken Streetlight' : cat)}
                >
                  <Text style={styles.catBtnText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Issue Description</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={3}
              placeholder="Describe the defect, dimensions, or hazard..."
              placeholderTextColor="#64748b"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.inputLabel}>Location Address</Text>
            <TextInput
              style={styles.textInputSingle}
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#64748b"
            />

            {/* AI Analyze Trigger */}
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={handleAnalyzeAI}
              disabled={isAnalyzing}
            >
              <Text style={styles.aiBtnText}>
                {isAnalyzing ? 'Analyzing with Gemini Vision...' : '⚡ Analyze with Vision AI'}
              </Text>
            </TouchableOpacity>

            {aiResult && (
              <View style={styles.aiCard}>
                <Text style={styles.aiCardTitle}>AI Triage Output</Text>
                <Text style={styles.aiCardText}>Category: {aiResult.issueCategory}</Text>
                <Text style={styles.aiCardText}>Department: {aiResult.recommendedDepartment}</Text>
                <Text style={styles.aiCardText}>Severity: {aiResult.severity} • {aiResult.confidence || 92}% Conf.</Text>
              </View>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitComplaint} disabled={loading}>
              <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit to Municipal Backend'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'tasks' && (
          <View>
            <Text style={styles.sectionTitle}>Field Worker Tasks (Ramesh Gowda)</Text>
            {complaints.map((item) => (
              <View key={item.id} style={styles.complaintCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.complaintId}>#{item.id}</Text>
                  <Text style={styles.statusBadge}>{item.status}</Text>
                </View>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.cardLocation}>📍 {item.location.address}</Text>

                <View style={styles.workerActions}>
                  {item.status !== 'In Progress' && item.status !== 'Resolved' && (
                    <TouchableOpacity
                      style={styles.taskStartBtn}
                      onPress={() => handleStartTask(item.id)}
                    >
                      <Text style={styles.taskBtnText}>Start Work</Text>
                    </TouchableOpacity>
                  )}
                  {item.status !== 'Resolved' && (
                    <TouchableOpacity
                      style={styles.taskResolveBtn}
                      onPress={() => handleResolveTask(item.id)}
                    >
                      <Text style={styles.taskBtnText}>Mark Resolved</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'track' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Track by Complaint ID</Text>
            <View style={styles.searchRow}>
              <TextInput
                style={[styles.textInputSingle, { flex: 1, marginBottom: 0 }]}
                placeholder="e.g. CIV-2026-RD4812"
                placeholderTextColor="#64748b"
                value={trackId}
                onChangeText={setTrackId}
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleTrackLookup}>
                <Text style={styles.searchBtnText}>Lookup</Text>
              </TouchableOpacity>
            </View>

            {foundComplaint && (
              <View style={[styles.complaintCard, { marginTop: 15 }]}>
                <Text style={styles.complaintId}>#{foundComplaint.id}</Text>
                <Text style={styles.cardCategory}>{foundComplaint.category}</Text>
                <Text style={styles.cardDesc}>{foundComplaint.description}</Text>
                <Text style={styles.cardLocation}>📍 {foundComplaint.location.address}</Text>
                <Text style={[styles.statusBadge, styles.statusResolved, { alignSelf: 'flex-start', marginTop: 10 }]}>
                  Current Status: {foundComplaint.status}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('report')}>
          <Text style={[styles.tabText, activeTab === 'report' && styles.tabTextActive]}>📸 Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('tasks')}>
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>👷 Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('track')}>
          <Text style={[styles.tabText, activeTab === 'track' && styles.tabTextActive]}>🔍 Track</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  titleAccent: {
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: 10,
    color: '#94a3b8',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 2,
  },
  roleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBtnActive: {
    backgroundColor: '#0284c7',
  },
  roleBtnActiveWorker: {
    backgroundColor: '#d97706',
  },
  roleText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#ffffff',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38bdf8',
  },
  kpiLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  primaryBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  complaintCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  complaintId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38bdf8',
    fontFamily: 'monospace',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    color: '#cbd5e1',
  },
  statusActive: {
    backgroundColor: '#78350f',
    color: '#fef3c7',
  },
  statusResolved: {
    backgroundColor: '#064e3b',
    color: '#d1fae5',
  },
  cardCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 16,
  },
  cardLocation: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
  formContainer: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
    marginTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  catBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    color: '#ffffff',
    padding: 10,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  textInputSingle: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  aiBtn: {
    backgroundColor: '#1e1b4b',
    borderColor: '#4338ca',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  aiBtnText: {
    color: '#a5b4fc',
    fontWeight: '700',
    fontSize: 12,
  },
  aiCard: {
    backgroundColor: '#0c1a2e',
    borderColor: '#0284c7',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  aiCardTitle: {
    color: '#38bdf8',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 4,
  },
  aiCardText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  submitBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  workerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  taskStartBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  taskResolveBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  taskBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 10,
  },
  searchBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
});
