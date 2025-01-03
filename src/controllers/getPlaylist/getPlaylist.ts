import { Request, Response } from 'express';
import { RequestLink } from 'src/types/types';
import ytpl from '@distube/ytpl';
const getPlaylist = async (req: Request, res: Response) => {
  try {
    const { link }: RequestLink = req.body;
    const response = await ytpl(link);

    const details = {
      title: response.title,
      total_items: response.total_items,
    };

    const items = response.items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        shortUrl: item.url_simple,
        thumbnail: item.thumbnail,
      };
    });

    res.status(200).json({
      ok: true,
      data: {
        details,
        items,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Failed to fetch the playlist',
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export default getPlaylist;
