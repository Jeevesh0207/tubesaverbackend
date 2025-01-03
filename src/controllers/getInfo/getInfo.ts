import { Request, Response } from 'express';
import { RequestLink } from '../../types/types';
import ytdl from '@distube/ytdl-core';
import { formatContentLength } from '../../utils/formatContentLength';
import { formatTime } from '../../utils/formatTime';
import { agent } from '../../cookies/cookies';
import { resolutionLabels } from '../../utils/resolutionLabels';

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
      link:info.videoDetails.video_url
    };

    const formats = info.formats;

    const audioFormats = formats
      .filter((format) => format.mimeType?.includes('audio'))
      .map((format) => ({
        size: formatContentLength(format.contentLength),
        bitrate: format.audioBitrate,
        sizeInBytes: format.contentLength,
        itag:format.itag
      }))
      .sort((a, b) => parseInt(b.sizeInBytes) - parseInt(a.sizeInBytes)); 

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
        label: resolutionLabels[format.qualityLabel] || '',
        sizeInBytes: format.contentLength,
        itag:format.itag
      }))
      .sort((a, b) => parseInt(b.sizeInBytes) - parseInt(a.sizeInBytes)); 

    res.status(200).json({
      ok: true,
      data: {
        details,
        audioFormats,
        videoFormats,
      },
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
