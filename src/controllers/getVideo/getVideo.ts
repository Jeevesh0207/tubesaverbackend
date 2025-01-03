import { Request, Response } from 'express';
import { RequestItag } from 'src/types/types';
import { agent } from '../../cookies/cookies';
import ytdl from '@distube/ytdl-core';

const getVideo = async (req: Request, res: Response) => {
  try {
    const { link, itag }: RequestItag = req.body;
    const info = await ytdl.getInfo(link, { agent });
    const formats = info.formats;

    const audioFormats = formats
      .filter((format) => format.mimeType?.includes('audio'))
      .map((format) => ({
        url: format.url,
        bitrate: format.bitrate,
      }));

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
              bitrate: number | undefined;
              url: string;
            } | null,
          )
        : null;

    const videoFormats = formats
      .filter(
        (format) =>
          format.mimeType?.includes('video') &&
          format.contentLength &&
          format.qualityLabel &&
          format.url &&
          format.itag === itag,
      )
      .map((format) => format.url)[0];

    res.status(200).json({
      ok: true,
      data: {
        videoFormats: videoFormats || '',
        defaultAudio: defaultAudio?.url,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Failed to fetch the video',
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export default getVideo;
