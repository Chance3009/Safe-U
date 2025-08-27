import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';

export default function ReportScreen() {
    const [isRecording, setIsRecording] = useState(false);
    const [reportType, setReportType] = useState('security');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [reportTitle, setReportTitle] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const categories = [
        { id: 'security', name: 'Security Concern', icon: 'shield', color: '#FF4444' },
        { id: 'harassment', name: 'Harassment', icon: 'warning', color: '#FF9500' },
        { id: 'facility', name: 'Facility Issue', icon: 'build', color: '#007AFF' },
        { id: 'suspicious', name: 'Suspicious Activity', icon: 'eye', color: '#AF52DE' },
        { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: '#666666' },
    ];

    const reportStatuses = [
        { id: '1', title: 'Suspicious person near library', category: 'Security Concern', status: 'open', date: '2024-01-15' },
        { id: '2', title: 'Broken streetlight on campus', category: 'Facility Issue', status: 'acknowledged', date: '2024-01-14' },
        { id: '3', title: 'Harassment in parking lot', category: 'Harassment', status: 'resolved', date: '2024-01-10' },
    ];

    const handleVoiceReport = () => {
        if (isRecording) {
            setIsRecording(false);
            Alert.alert('Recording Stopped', 'Your voice report has been saved and will be processed.');
        } else {
            setIsRecording(true);
            Alert.alert('Recording Started', 'Hold the button and speak your report. Release when done.');
            // TODO: Implement actual voice recording
            setTimeout(() => {
                setIsRecording(false);
                Alert.alert('Recording Complete', 'Your voice report has been processed and saved.');
            }, 5000);
        }
    };

    const handleSubmitReport = () => {
        if (!reportTitle || !reportDescription || !selectedCategory) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        Alert.alert(
            'Report Submitted',
            'Your report has been submitted successfully. Campus security will review it shortly.',
            [{ text: 'OK' }]
        );

        // Reset form
        setReportTitle('');
        setReportDescription('');
        setSelectedCategory('');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return '#FF4444';
            case 'acknowledged': return '#FF9500';
            case 'resolved': return '#34C759';
            default: return '#666666';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return 'time';
            case 'acknowledged': return 'checkmark-circle';
            case 'resolved': return 'checkmark-done-circle';
            default: return 'help-circle';
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
            {/* Voice Report Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Voice Report
                </Text>

                <TouchableOpacity
                    style={[
                        styles.voiceButton,
                        { backgroundColor: isRecording ? '#FF4444' : '#007AFF' }
                    ]}
                    onPress={handleVoiceReport}
                >
                    <Ionicons
                        name={isRecording ? "stop-circle" : "mic"}
                        size={40}
                        color="white"
                    />
                    <Text style={styles.voiceButtonText}>
                        {isRecording ? 'Recording...' : 'Hold to Record Report'}
                    </Text>
                    <Text style={styles.voiceButtonSubtext}>
                        {isRecording ? 'Release to stop recording' : '10-second hold-to-talk'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Manual Report Form */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Manual Report
                </Text>

                {/* Category Selection */}
                <Text style={[styles.formLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Report Category
                </Text>
                <View style={styles.categoryGrid}>
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                { backgroundColor: isDark ? '#333333' : '#f0f0f0' },
                                selectedCategory === category.id && { borderColor: category.color, borderWidth: 2 }
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <Ionicons name={category.icon as any} size={24} color={category.color} />
                            <Text style={[styles.categoryText, { color: isDark ? '#ffffff' : '#000000' }]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Report Title */}
                <Text style={[styles.formLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Report Title
                </Text>
                <TextInput
                    style={[styles.textInput, {
                        backgroundColor: isDark ? '#333333' : '#f0f0f0',
                        color: isDark ? '#ffffff' : '#000000'
                    }]}
                    placeholder="Brief description of the incident"
                    placeholderTextColor={isDark ? '#999999' : '#666666'}
                    value={reportTitle}
                    onChangeText={setReportTitle}
                />

                {/* Report Description */}
                <Text style={[styles.formLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Detailed Description
                </Text>
                <TextInput
                    style={[styles.textArea, {
                        backgroundColor: isDark ? '#333333' : '#f0f0f0',
                        color: isDark ? '#ffffff' : '#000000'
                    }]}
                    placeholder="Provide detailed information about what happened, when, where, and any other relevant details..."
                    placeholderTextColor={isDark ? '#999999' : '#666666'}
                    value={reportDescription}
                    onChangeText={setReportDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                {/* Anonymous Toggle */}
                <View style={styles.anonymousToggle}>
                    <Text style={[styles.formLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                        Submit Anonymously
                    </Text>
                    <Switch
                        value={isAnonymous}
                        onValueChange={setIsAnonymous}
                        trackColor={{ false: '#767577', true: '#34C759' }}
                        thumbColor={isAnonymous ? '#ffffff' : '#f4f3f4'}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: '#34C759' }]}
                    onPress={handleSubmitReport}
                >
                    <Ionicons name="send" size={24} color="white" />
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                </TouchableOpacity>
            </View>

            {/* My Reports Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                    My Reports
                </Text>

                <View style={styles.reportsList}>
                    {reportStatuses.map(report => (
                        <View key={report.id} style={[styles.reportItem, { backgroundColor: isDark ? '#333333' : '#f0f0f0' }]}>
                            <View style={styles.reportHeader}>
                                <Text style={[styles.reportTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                                    {report.title}
                                </Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                                    <Ionicons name={getStatusIcon(report.status) as any} size={16} color="white" />
                                    <Text style={styles.statusText}>{report.status}</Text>
                                </View>
                            </View>

                            <View style={styles.reportDetails}>
                                <Text style={[styles.reportCategory, { color: isDark ? '#999999' : '#666666' }]}>
                                    {report.category}
                                </Text>
                                <Text style={[styles.reportDate, { color: isDark ? '#999999' : '#666666' }]}>
                                    {report.date}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Quick Report Actions */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Quick Actions
                </Text>

                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: isDark ? '#333333' : '#f0f0f0' }]}>
                        <Ionicons name="camera" size={24} color="#007AFF" />
                        <Text style={[styles.quickActionText, { color: isDark ? '#ffffff' : '#000000' }]}>
                            Add Photo
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: isDark ? '#333333' : '#f0f0f0' }]}>
                        <Ionicons name="videocam" size={24} color="#FF9500" />
                        <Text style={[styles.quickActionText, { color: isDark ? '#ffffff' : '#000000' }]}>
                            Add Video
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: isDark ? '#333333' : '#f0f0f0' }]}>
                        <Ionicons name="location" size={24} color="#34C759" />
                        <Text style={[styles.quickActionText, { color: isDark ? '#ffffff' : '#000000' }]}>
                            Pin Location
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: isDark ? '#333333' : '#f0f0f0' }]}>
                        <Ionicons name="map" size={24} color="#AF52DE" />
                        <Text style={[styles.quickActionText, { color: isDark ? '#ffffff' : '#000000' }]}>
                            2.5D Map
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    voiceButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    voiceButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center',
    },
    voiceButtonSubtext: {
        color: 'white',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        opacity: 0.9,
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    categoryButton: {
        width: '48%',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    textInput: {
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
    },
    textArea: {
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
        height: 100,
    },
    anonymousToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 12,
        gap: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    reportsList: {
        gap: 15,
    },
    reportItem: {
        padding: 15,
        borderRadius: 12,
    },
    reportHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        gap: 5,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    reportDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reportCategory: {
        fontSize: 14,
    },
    reportDate: {
        fontSize: 14,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionButton: {
        width: '48%',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
});
