export const fragments = {
  cpp: {
    twoSum: `vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int, int> numMap;
  for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (numMap.count(complement)) {
      return {numMap[complement], i};
    }
    numMap[nums[i]] = i;
  }
  return {};
}`,
    validParentheses: `bool isValid(string s) {
  stack<char> st;
  for (char c : s) {
    if (c == '(' || c == '{' || c == '[') {
      st.push(c);
    } else {
      if (st.empty()) {
        return false;
      }
      if (c == ')' && st.top() != '(') {
        return false;
      }
      if (c == '}' && st.top() != '{') {
        return false;
      }
      if (c == ']' && st.top() != '[') {
        return false;
      }
      st.pop();
    }
  }
  return st.empty();
}`,
    bestTime: `int maxProfit(vector<int>& prices) {
  int minPrice = INT_MAX;
  int maxProf = 0;
  for (int i = 0; i < prices.size(); i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else if (prices[i] - minPrice > maxProf) {
      maxProf = prices[i] - minPrice;
    }
  }
  return maxProf;
}`
  },
  php: {
    twoSum: `<?php
function twoSum($nums, $target) {
  $map = [];
  foreach ($nums as $i => $num) {
    $complement = $target - $num;
    if (isset($map[$complement])) {
      return [$map[$complement], $i];
    }
    $map[$num] = $i;
  }
  return [];
}
?>`,
    validParentheses: `<?php
function isValid($s) {
  $stack = [];
  $map = [')' => '(', '}' => '{', ']' => '['];

  for ($i = 0; $i < strlen($s); $i++) {
    $c = $s[$i];

    if (isset($map[$c])) {
      $top = empty($stack) ? '#' : array_pop($stack);
      if ($top !== $map[$c]) {
        return false;
      }
    } else {
      $stack[] = $c;
    }
  }

  return empty($stack);
}
?>`,
    bestTime: `<?php
function maxProfit($prices) {
  $minPrice = PHP_INT_MAX;
  $maxProf = 0;

  foreach ($prices as $price) {
    if ($price < $minPrice) {
      $minPrice = $price;
    } elseif ($price - $minPrice > $maxProf) {
      $maxProf = $price - $minPrice;
    }
  }

  return $maxProf;
}
?>`
  },
  python: {
    twoSum: `def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
    validParentheses: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}

    for char in s:
        if char in mapping:
            top = stack.pop() if stack else "#"
            if mapping[char] != top:
                return False
        else:
            stack.append(char)

    return not stack`,
    bestTime: `def maxProfit(prices):
    min_price = float("inf")
    max_prof = 0

    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_prof:
            max_prof = price - min_price

    return max_prof`
  }
} as const;
