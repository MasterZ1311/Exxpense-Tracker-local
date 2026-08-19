import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

/**
 * Shares a CSV file using native OS share sheet (AirDrop, WhatsApp, Google Drive, Files, etc.)
 */
export async function shareCsvFile(filename: string, csvContent: string): Promise<boolean> {
  try {
    const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    const filePath = `${FileSystem.cacheDirectory}${cleanFilename}`;
    
    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export FinTrack Pro Ledger',
        UTI: 'public.comma-separated-values-text',
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sharing CSV file:', error);
    throw error;
  }
}

/**
 * Shares a JSON backup file using native OS share sheet
 */
export async function shareJsonBackupFile(filename: string, jsonContent: string): Promise<boolean> {
  try {
    const cleanFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
    const filePath = `${FileSystem.cacheDirectory}${cleanFilename}`;

    await FileSystem.writeAsStringAsync(filePath, jsonContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Export FinTrack Pro Backup',
        UTI: 'public.json',
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sharing backup file:', error);
    throw error;
  }
}

/**
 * Opens native file picker to select a statement or backup file
 */
export async function pickDocumentFile(allowedTypes: string[] = ['text/csv', 'application/json', 'text/plain']): Promise<{ name: string; content: string } | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: allowedTypes,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return {
      name: asset.name,
      content: fileContent,
    };
  } catch (error) {
    console.error('Error picking document file:', error);
    throw error;
  }
}
