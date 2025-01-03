import { Request, Response } from 'express';
import { RequestItag } from 'src/types/types';
import { agent } from '../../cookies/cookies';
import ytdl from '@distube/ytdl-core';

const getAudio = async (req: Request, res: Response) => {
  try {
    const { link, itag }: RequestItag = req.body;
    const info = await ytdl.getInfo(link, { agent });
    const formats = info.formats;

    const audioUrl = formats
      .filter(
        (format) =>
          format.mimeType?.includes('audio') &&
          format.url &&
          format.itag === itag,
      )
      .map((format) => format.url)[0];

    res.status(200).json({
      ok: true,
      data: {
        audioUrl: audioUrl || '',
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Failed to fetch the audio',
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export default getAudio;
