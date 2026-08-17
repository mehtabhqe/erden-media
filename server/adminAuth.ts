function constantTimeEqual(left: string, right: string) {
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

export function verifyAdminCredentials(username: string, password: string) {
  const configuredUsername = process.env.AGENCYOS_ADMIN_USERNAME ?? "";
  const configuredPassword = process.env.AGENCYOS_ADMIN_PASSWORD ?? "";
  if (!configuredUsername || !configuredPassword || !username || !password) return false;
  return constantTimeEqual(username, configuredUsername) && constantTimeEqual(password, configuredPassword);
}
