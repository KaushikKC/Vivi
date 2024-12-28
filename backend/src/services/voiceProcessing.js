// src/services/voiceProcessing.js
const vosk = require("vosk");
const wav = require("node-wav");
const { Readable } = require("stream");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs").promises;
const os = require("os");

class VoiceProcessingService {
  constructor() {
    // Initialize Vosk model for speech recognition
    // Download a small model from https://alphacephei.com/vosk/models
    const modelPath = path.join(
      __dirname,
      "../models/vosk-model-small-en-us-0.15"
    );
    this.model = new vosk.Model(modelPath);
    this.recognizer = new vosk.Recognizer({
      model: this.model,
      sampleRate: 16000,
    });
  }

  /**
   * Anonymize voice by applying pitch and speed modifications
   * @param {Buffer} audioBuffer - Original audio buffer
   * @returns {Promise<Buffer>} - Processed audio buffer
   */
  static async anonymizeVoice(audioBuffer) {
    const tempInput = path.join(os.tmpdir(), `input-${Date.now()}.wav`);
    const tempOutput = path.join(os.tmpdir(), `output-${Date.now()}.wav`);

    try {
      // Write input buffer to temporary file
      await fs.writeFile(tempInput, audioBuffer);

      // Apply voice modifications using ffmpeg
      await new Promise((resolve, reject) => {
        ffmpeg(tempInput)
          .audioFilters([
            // Pitch shifting (value > 1 increases pitch, < 1 decreases pitch)
            {
              filter: "rubberband",
              options: { pitch: "0.8" },
            },
            // Speed modification
            {
              filter: "atempo",
              options: "1.1",
            },
            // Voice disguise filter
            {
              filter: "asetrate",
              options: "44100*0.9",
            },
          ])
          .audioFrequency(44100)
          .audioChannels(1)
          .format("wav")
          .save(tempOutput)
          .on("end", resolve)
          .on("error", reject);
      });

      // Read processed file
      const processedBuffer = await fs.readFile(tempOutput);

      // Cleanup temporary files
      await Promise.all([fs.unlink(tempInput), fs.unlink(tempOutput)]);

      return processedBuffer;
    } catch (error) {
      // Cleanup on error
      try {
        await Promise.all([fs.unlink(tempInput), fs.unlink(tempOutput)]);
      } catch (e) {
        console.error("Cleanup error:", e);
      }
      throw new Error(`Voice anonymization failed: ${error.message}`);
    }
  }

  /**
   * Transcribe audio using Vosk (free and offline)
   * @param {Buffer} audioBuffer - Audio buffer to transcribe
   * @returns {Promise<string>} - Transcribed text
   */
  static async transcribeAudio(audioBuffer) {
    try {
      // Convert audio to correct format for Vosk
      const tempInput = path.join(os.tmpdir(), `input-${Date.now()}.wav`);
      const tempOutput = path.join(os.tmpdir(), `output-${Date.now()}.wav`);

      // Write input buffer to temporary file
      await fs.writeFile(tempInput, audioBuffer);

      // Convert to proper format for Vosk
      await new Promise((resolve, reject) => {
        ffmpeg(tempInput)
          .audioFrequency(16000)
          .audioChannels(1)
          .format("wav")
          .save(tempOutput)
          .on("end", resolve)
          .on("error", reject);
      });

      // Read converted file
      const convertedBuffer = await fs.readFile(tempOutput);

      // Initialize Vosk recognizer
      const model = new vosk.Model(
        path.join(__dirname, "../models/vosk-model-small-en-us-0.15")
      );
      const recognizer = new vosk.Recognizer({
        model: model,
        sampleRate: 16000,
      });

      // Process audio
      recognizer.acceptWaveform(convertedBuffer);
      const result = recognizer.finalResult();

      // Cleanup
      await Promise.all([fs.unlink(tempInput), fs.unlink(tempOutput)]);

      recognizer.free();
      model.free();

      return result.text;
    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  /**
   * Get audio duration in seconds
   * @param {Buffer} audioBuffer - Audio buffer
   * @returns {Promise<number>} - Duration in seconds
   */
  static async getAudioDuration(audioBuffer) {
    return new Promise((resolve, reject) => {
      const tempFile = path.join(os.tmpdir(), `duration-${Date.now()}.wav`);

      fs.writeFile(tempFile, audioBuffer)
        .then(() => {
          ffmpeg.ffprobe(tempFile, (err, metadata) => {
            fs.unlink(tempFile).catch(console.error);

            if (err) {
              reject(err);
              return;
            }

            resolve(metadata.format.duration);
          });
        })
        .catch(reject);
    });
  }

  /**
   * Check if audio meets quality requirements
   * @param {Buffer} audioBuffer - Audio buffer to check
   * @returns {Promise<boolean>} - True if audio meets requirements
   */
  static async checkAudioQuality(audioBuffer) {
    try {
      const tempFile = path.join(os.tmpdir(), `quality-${Date.now()}.wav`);
      await fs.writeFile(tempFile, audioBuffer);

      const stats = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(tempFile, (err, metadata) => {
          fs.unlink(tempFile).catch(console.error);
          if (err) reject(err);
          else resolve(metadata);
        });
      });

      // Check various quality parameters
      const { bit_rate, duration, channels } = stats.format;
      const minBitRate = 64000; // 64kbps
      const minDuration = 1; // 1 second
      const maxDuration = 300; // 5 minutes

      return (
        bit_rate >= minBitRate &&
        duration >= minDuration &&
        duration <= maxDuration &&
        channels >= 1
      );
    } catch (error) {
      throw new Error(`Audio quality check failed: ${error.message}`);
    }
  }
}

module.exports = VoiceProcessingService;
