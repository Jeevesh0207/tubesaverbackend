import { Request, Response } from 'express';
import { RequestLink } from '../../types/types';
import ytdl from '@distube/ytdl-core';
import { formatContentLength } from '../../utils/formatContentLength';
import { formatTime } from '../../utils/formatTime';
import { agent } from '../../cookies/cookies';

const getInfo = async (req: Request, res: Response) => {
  try {
    const { link }: RequestLink = req.body;
    const info = await ytdl.getInfo(link, { agent });

    const len_thumb = info.videoDetails.thumbnails.length;

    const details = {
      title: info.videoDetails.title,
      duration: formatTime(info.videoDetails.lengthSeconds),
      thumbnails: info.videoDetails.thumbnails[len_thumb - 1].url,
      author: info.videoDetails.author.name,
    };

    const formats = info.formats;

    // Mapping for resolution labels
    const resolutionLabels: Record<string, string> = {
      '1440p': '2K',
      '1440p60': '2K',
      '1440p60 HDR': '2K',
      '2160p': '4K',
      '2160p60': '4K',
      '2160p60 HDR': '4K',
      '4320p': '8K',
      '4320p60': '8K',
    };

    // Separate audio-only formats
    const audioFormats = formats
      .filter((format) => format.mimeType?.includes('audio'))
      .map((format) => ({
        size: formatContentLength(format.contentLength),
        bitrate: format.audioBitrate,
        url: format.url,
      }))
      .sort((a, b) => parseInt(b.size) - parseInt(a.size)); // Sort by size descending

    // Select default audio (best audio file by bitrate)
    const defaultAudio =
      audioFormats.length > 0
        ? audioFormats.reduce(
            (best, current) => {
              if (
                !best ||
                (current.bitrate && current.bitrate > (best.bitrate ?? 0))
              ) {
                return current;
              }
              return best;
            },
            null as {
              size: string;
              bitrate: number | undefined;
              url: string;
            } | null,
          )
        : null;

    // Separate video-only formats
    const videoFormats = formats
      .filter(
        (format) =>
          format.mimeType?.includes('video') &&
          format.contentLength &&
          format.qualityLabel &&
          format.url,
      )
      .map((format) => ({
        size: formatContentLength(format.contentLength),
        quality: format.qualityLabel,
        fps: format?.fps ?? '',
        url: format.url,
        label: resolutionLabels[format.qualityLabel] || '',
      }))
      .sort((a, b) => parseInt(b.size) - parseInt(a.size)); // Sort by size descending

    res.status(200).json({
      details,
      audioFormats,
      defaultAudio,
      videoFormats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Failed to retrieve video information.',
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export default getInfo;
