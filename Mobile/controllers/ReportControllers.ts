
import { Alert } from 'react-native';

// Handles voice report recording logic
export function handleVoiceReport(isRecording: boolean, setIsRecording: (v: boolean) => void) {
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
}

// Handles manual report submission logic
export function handleSubmitReport({
	reportTitle,
	reportDescription,
	selectedCategory,
	setReportTitle,
	setReportDescription,
	setSelectedCategory
}: {
	reportTitle: string,
	reportDescription: string,
	selectedCategory: string,
	setReportTitle: (v: string) => void,
	setReportDescription: (v: string) => void,
	setSelectedCategory: (v: string) => void
}) {
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
}

// Returns color for a given report status
export function getStatusColor(status: string) {
	switch (status) {
		case 'open': return '#FF4444';
		case 'acknowledged': return '#FF9500';
		case 'resolved': return '#34C759';
		default: return '#666666';
	}
}

// Returns icon name for a given report status
export function getStatusIcon(status: string) {
	switch (status) {
		case 'open': return 'time';
		case 'acknowledged': return 'checkmark-circle';
		case 'resolved': return 'checkmark-done-circle';
		default: return 'help-circle';
	}
}
