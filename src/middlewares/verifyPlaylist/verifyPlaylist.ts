import { Request, Response, NextFunction } from 'express';
import { RequestLink } from 'src/types/types';
import ytpl from '@distube/ytpl';
const verifyPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { link }: RequestLink = req.body;
    if (!link || link.trim() === '') {
      res
        .status(400)
        .json({ ok: false, message: 'Link is required and cannot be empty' });
      return;
    }
    const isValid = ytpl.validateID(link);
    if (!isValid) {
      res.status(400).json({
        ok: false,
        msg: 'Invalid playlist link',
      });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
    return;
  }
};

export default verifyPlaylist;
