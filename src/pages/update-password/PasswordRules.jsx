import React from "react";

const PasswordRules = () => {
  const rules = [
    {
      content:
        "Encourage users to create passwords that are at least 12-16 characters long. Longer passwords are generally more secure.",
    },
    {
      content:
        "Suggest that passwords include a mix of the following: - Uppercase letters (A-Z) - Lowercase letters (a-z) - Numbers (0-9) - Special characters (e.g., !, @, #, $, %)",
    },
    {
      content:
        'Advise users not to use easily guessable information such as common words, phrases, or patterns like "password," "123456," or "qwerty."',
    },
    {
      content:
        "Remind users to avoid using easily obtainable personal information, such as their name, birthdate, or family members' names",
    },
    {
      content:
        "Recommend avoiding dictionary words or common phrases, as these can be easily cracked using dictionary attacks",
    },
    {
      content:
        "Stress the importance of using unique passwords for different accounts. Reusing passwords across multiple accounts increases the risk if one account gets compromised.",
    },
  ];
  return (
    <div className="password-rules-container">
      <div className="rule-title">Password must contain :</div>
      <div className="rules-list">
        <ul>
          {rules?.map((rule, i) => (
            <li className="rule" key={i}>
              {rule?.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordRules;
