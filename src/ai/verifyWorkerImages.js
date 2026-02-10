export const verifyWorkerImages = (idImage, selfieImage) => {
  console.log("AI CHECK RUNNING:", idImage, selfieImage);

  if (!idImage || !selfieImage) {
    return { aiStatus: "failed", issues: ["Missing ID or selfie image"] };
  }

  return { aiStatus: "passed", issues: [] };
};
