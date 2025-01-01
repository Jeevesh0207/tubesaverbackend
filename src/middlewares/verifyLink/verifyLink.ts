import { Request, Response, NextFunction } from 'express';
import ytdl from '@distube/ytdl-core';

import { RequestLink } from '../../types/types';

const verifyLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { link }: RequestLink = req.body;
    if (!link || link.trim() === '') {
      res
        .status(400)
        .json({ ok: false, message: 'Link is required and cannot be empty' });
      return;
    }
    const isValid = ytdl.validateURL(link);
    if (!isValid) {
      res.status(500).json({
        ok: false,
        message: 'The provided link is not a valid YouTube URL',
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Your link is invalid',
    });
    return;
  }
};

export default verifyLink;
