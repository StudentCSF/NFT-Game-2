import { rewardHandler, findPlayerUrl, putHighScore } from './gameService';
import { NextFunction, Request, Response } from 'express';


export async function reward(req: Request, res: Response, next: NextFunction) {
  try {
    const { score } = req.body;

    let rewardUrl = await rewardHandler(score);

    res.status(200).json({ rewardUrl });
  } catch (err) {
    next(err);
  }
}

export async function getPlayerData(req: Request, res: Response, next: NextFunction) {
  try {
    const { address } = req.body;

    const result = await findPlayerUrl(address);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function setPlayerHighScore(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, highScore } = req.body;

    const result = await putHighScore(address, highScore);

    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
}

// export async function ipfs(req: Request, res: Response, next: NextFunction) {
//   try {
//     const message = await testIPFS();
//     res.status(200).json({ message });
//   } catch (err) {
//     next(err);
//   }
// }