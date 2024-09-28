const axios = require('axios');
const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

// API base URL
const apiUrl = 'https://gdapi.viatg.workers.dev/listFilesInFolder.aspx?folderId=';

// Array of folder IDs and their corresponding names
const foldersData = [
  { id: '1y8bnKjngGHhNknAfSL3151nNYrHUGFWv', name: '1 Folder' },
  { id: '1ZU7eybx8O0QzVMPKysqIxsC5h5Vx7z7j', name: '2 Folder' },
  { id: '1MehLgwyS0Xc44PqhnIc6mBIpYToMyzW_', name: '3 Folder' },
  { id: '1y8r76DMsZypV0-AuCPNf_GOyRRAfKMWs', name: '4 Folder' },
  { id: '1uKl9YYSsU6oLz142AV1KngDPQ2J5P4MT', name: 'First Steps With Javascript' },
  // Add more folder IDs and names as needed
];

async function createFolders() {
  try {
    for (const folderData of foldersData) {
      // Find the folder in the database
      const existingFolder = await database.FolderId.findUnique({
        where: { id: folderData.id }
      });

      // If the folder doesn't exist, create it
      if (!existingFolder) {
        await database.FolderId.create({
          data: folderData,
        });
        console.log(`Folder ${folderData.name} created.`);
      } else {
        // If the folder already exists, update its name if it has changed
        if (existingFolder.name !== folderData.name) {
          await database.FolderId.update({
            where: { id: folderData.id },
            data: { name: folderData.name },
          });
          console.log(`Folder ${folderData.id} updated with new name: ${folderData.name}`);
        } else {
          console.log(`Folder ${folderData.name} already exists.`);
        }
      }
    }

    console.log('Folders created/updated successfully!');
  } catch (error) {
    console.error('Error creating/updating folders:', error);
  } finally {
    // Disconnect Prisma client
    await database.$disconnect();
  }
}

async function fetchAndSaveVideos() {
  try {
    const videosToCreate = [];
    let totalVideos = 0;
    let processedVideos = 0;

    // Iterate over each folder in the database
    const folders = await database.FolderId.findMany();
    for (const folder of folders) {
      // Construct the URL for the current folder
      const url = `${apiUrl}${folder.id}`;

      // Make an HTTP GET request to fetch the list of files from the folder
      const response = await axios.get(url);

      // Extract the files array from the response data
      const files = response.data.files;

      // Iterate over each file
      for (const file of files) {
        // Increment the total count of files
        totalVideos++;

        // Check if the file is a video (you may need to adjust this check based on your file naming convention or other criteria)
        if (file.mimeType.startsWith('video/')) {
          // Collect data for video creation
          videosToCreate.push({
            id: file.id, // Assuming 'id' contains the video URL
            name: file.name, // Optionally, save other details like the name of the video
            folderId: folder.id, // Save the current folder ID associated with the video
          });
          processedVideos++;
        }
      }
    }

    console.log(`Processed ${processedVideos} out of ${totalVideos} files as videos.`);

    // Delete all existing videos from the database
    await database.GDVideo.deleteMany();

    // Save all new videos in the database
    if (videosToCreate.length > 0) {
      await database.GDVideo.createMany({
        data: videosToCreate,
      });
    }

    console.log('Videos saved successfully!');
  } catch (error) {
    console.error('Error fetching and saving videos:', error);
  } finally {
    // Disconnect Prisma client
    await database.$disconnect();
  }
}

async function main() {
  try {
    await createFolders();
    await fetchAndSaveVideos();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
