import type { PracticeDataset } from "@/content/types";
import { code } from "@/content/code";

/**
 * Practice drills for the runnable data science lessons. These run real NumPy
 * and pandas in the browser, so every set declares the packages it needs.
 */
export const pythonDataPractice: Record<string, PracticeDataset> = {
  "py-numpy-arrays": {
    packages: ["numpy"],
    prompt: "Arrange the lines to keep only the fast readings and average them.",
    parsonsFragments: [
      { id: "np1", text: "import numpy as np", indent: 0 },
      { id: "np2", text: "speeds = np.array([12, 40, 7, 33])", indent: 0 },
      { id: "np3", text: "fast = speeds[speeds > 20]", indent: 0 },
      { id: "np4", text: "print(fast.mean())", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to pick the hot readings and average them.",
    fadedLines: [
      { text: "temps = np.array([15.0, 22.0, 31.0])", blanks: [] },
      { text: "hot = temps[temps ___ 20]", blanks: [">"] },
      { text: "print(hot.___())", blanks: ["mean"] },
    ],
    fadedExplain: "A comparison makes a mask of True and False, and indexing with it keeps the True positions.",
    predictCode: code`import numpy as np

a = np.array([1, 2, 3])
b = a
b[0] = 99
print(a)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[99  2  3]", correct: true, why: "b is another name for the same array, so changing b changes a. Use a.copy() to avoid this." },
      { id: "b", label: "[1 2 3]", correct: false, why: "NumPy did not copy the data; b points at the same array." },
      { id: "c", label: "[99, 2, 3]", correct: false, why: "That is how a Python list prints. NumPy separates values with spaces." },
    ],
  },
  "py-pandas-dataframes": {
    packages: ["pandas"],
    prompt: "Arrange the lines to keep the high scores and list their names.",
    parsonsFragments: [
      { id: "pd1", text: "import pandas as pd", indent: 0 },
      { id: "pd2", text: 'df = pd.DataFrame({"name": ["a", "b"], "score": [3, 9]})', indent: 0 },
      { id: "pd3", text: 'top = df[df["score"] > 5]', indent: 0 },
      { id: "pd4", text: 'print(top["name"].tolist())', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to keep the rainy rows and list their types.",
    fadedLines: [
      { text: 'rain = clouds[clouds["rain"] ___ True]', blanks: ["=="] },
      { text: 'print(rain["type"].___())', blanks: ["tolist"] },
    ],
    fadedExplain: "A comparison on a column gives a mask, and indexing the frame with it keeps the matching rows.",
    predictCode: code`import pandas as pd

df = pd.DataFrame({"city": ["Oslo", "Lima"], "temp": [3, 19]})
print(df["temp"].mean())`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "11.0", correct: true, why: "The mean of 3 and 19 is 11, and pandas returns it as a float." },
      { id: "b", label: "11", correct: false, why: "The mean of an integer column still comes back as a float." },
      { id: "c", label: "22", correct: false, why: "That is the sum. mean() divides by the number of rows." },
    ],
  },
  "py-data-cleaning": {
    packages: ["pandas", "numpy"],
    prompt: "Arrange the lines to turn messy text into numbers you can trust.",
    parsonsFragments: [
      { id: "cl1", text: "import pandas as pd", indent: 0 },
      { id: "cl2", text: 'df = pd.DataFrame({"temp": ["21", "warm", "18"]})', indent: 0 },
      { id: "cl3", text: 'df["temp"] = pd.to_numeric(df["temp"], errors="coerce")', indent: 0 },
      { id: "cl4", text: 'df = df.dropna(subset=["temp"])', indent: 0 },
      { id: "cl5", text: 'print(df["temp"].tolist())', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to replace the gaps with the column's median.",
    fadedLines: [
      { text: 'middle = df["humidity"].___()', blanks: ["median"] },
      { text: 'df["humidity"] = df["humidity"].___(middle)', blanks: ["fillna"] },
    ],
    fadedExplain: "`fillna` replaces every missing value, and the median is a safer filler than the mean when outliers exist.",
    predictCode: code`import pandas as pd
import numpy as np

s = pd.Series([1.0, np.nan, 3.0])
print(s.mean())
print(s.fillna(0).mean())`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2.0\n1.3333333333333333", correct: true, why: "mean() skips missing values, but filling them with 0 pulls the average down." },
      { id: "b", label: "2.0\n2.0", correct: false, why: "Once the gap is a 0 it counts as a real value, so the average changes." },
      { id: "c", label: "nan\nnan", correct: false, why: "pandas leaves missing values out of mean() instead of giving up." },
    ],
  },
};
