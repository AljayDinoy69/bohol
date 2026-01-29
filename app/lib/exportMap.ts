import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, ImageRun, TextRun } from 'docx';

interface ExportOptions {
  mapElementId?: string;
  title?: string;
  documentFileName?: string;
  imageWidth?: number;
  imageHeight?: number;
  scale?: number;
  backgroundColor?: string;
  successMessage?: string;
  errorMessage?: string;
  includeAnalytics?: boolean;
  includeSummary?: boolean;
}

async function fetchAnalyticsData() {
  try {
    const response = await fetch('/api/analytics');
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
}

async function fetchActivityLogs() {
  try {
    const response = await fetch('/api/activity-logs');
    if (!response.ok) throw new Error('Failed to fetch activity logs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
}

export const exportMapToWord = async (options: ExportOptions = {}) => {
  const {
    mapElementId = 'map-container',
    title = 'Bohol Signal Map Export',
    documentFileName = 'Bohol-Signal-Map',
    imageWidth = 600,
    imageHeight = 450,
    scale = 2,
    backgroundColor = '#000000',
    successMessage = 'Map exported successfully!',
    errorMessage = 'Map container not found',
    includeAnalytics = true,
    includeSummary = true
  } = options;

  try {
    // Get the map container element
    const mapElement = document.getElementById(mapElementId);
    
    if (!mapElement) {
      alert(errorMessage);
      return;
    }

    // Show loading state
    const exportBtn = document.querySelector('[data-export-btn]') as HTMLButtonElement;
    if (exportBtn) {
      const originalText = exportBtn.innerText;
      exportBtn.innerText = 'Exporting...';
      exportBtn.disabled = true;

      try {
        // Capture the map as an image
        const canvas = await html2canvas(mapElement, {
          scale,
          useCORS: true,
          logging: false,
          backgroundColor
        });

        const imageData = canvas.toDataURL('image/png');
        
        // Remove the data URL prefix to get just the base64
        const base64Image = imageData.split(',')[1];

        // Fetch dynamic data
        const [analyticsData, activityLogs] = await Promise.all([
          includeAnalytics ? fetchAnalyticsData() : Promise.resolve(null),
          includeSummary ? fetchActivityLogs() : Promise.resolve([])
        ]);

        // Build document children array dynamically
        const documentChildren = [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true
              })
            ],
            heading: 'Heading1',
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            text: `Export Date: ${new Date().toLocaleString()}`,
            spacing: {
              after: 400
            }
          })
        ];

        // Add analytics section if available
        if (includeAnalytics && analyticsData) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Analytics Summary:',
                  bold: true
                })
              ],
              spacing: {
                after: 200
              }
            })
          );

          // Add analytics data dynamically
          for (const [key, value] of Object.entries(analyticsData)) {
            documentChildren.push(
              new Paragraph({
                text: `${key}: ${value}`,
                spacing: {
                  after: 100
                }
              })
            );
          }

          documentChildren.push(
            new Paragraph({
              spacing: {
                after: 400
              }
            })
          );
        }

        // Add map image
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Map Image:',
                bold: true
              })
            ],
            spacing: {
              after: 200
            }
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: base64Image,
                type: 'png',
                transformation: {
                  width: imageWidth,
                  height: imageHeight
                }
              })
            ],
            spacing: {
              after: 400
            }
          })
        );

        // Add activity summary if available
        if (includeSummary && activityLogs && activityLogs.length > 0) {
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Recent Activity:',
                  bold: true
                })
              ],
              spacing: {
                after: 200
              }
            })
          );

          // Add recent logs dynamically
          activityLogs.slice(0, 10).forEach((log: any) => {
            documentChildren.push(
              new Paragraph({
                text: `${log.timestamp || new Date().toLocaleString()} - ${log.action || 'Activity'}`,
                spacing: {
                  after: 100
                }
              })
            );
          });
        }

        // Create a Word document with dynamic content
        const doc = new Document({
          sections: [
            {
              children: documentChildren
            }
          ]
        });

        // Generate and download the document
        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${documentFileName}-${new Date().getTime()}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert(successMessage);
      } finally {
        exportBtn.innerText = originalText;
        exportBtn.disabled = false;
      }
    }
  } catch (error) {
    console.error('Error exporting map:', error);
    alert('Failed to export map. Please try again.');
  }
};
