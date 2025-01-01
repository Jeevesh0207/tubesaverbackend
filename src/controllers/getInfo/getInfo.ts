import { Request, Response } from 'express';
import { RequestLink } from '../../types/types';
import ytdl from '@distube/ytdl-core';
import { formatContentLength } from '../../utils/formatContentLength';
import { agent } from '../../cookies/cookies';

const getInfo = async (req: Request, res: Response) => {
  try {
    const { link }: RequestLink = req.body;
    const info = await ytdl.getInfo(link, { agent });

    const details = {
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      thumbnails: info.videoDetails.thumbnails,
    };

    const formats = info.formats;

    // Separate audio-only formats
    const audioFormats = formats
      .filter((format) => format.mimeType?.includes('audio'))
      .map((format) => ({
        size: formatContentLength(format.contentLength),
        bitrate: format.audioBitrate,
        url: format.url,
      }));

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
      }));

    console.log(details, audioFormats, videoFormats);
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
      error,
    });
  }
};

export default getInfo;
