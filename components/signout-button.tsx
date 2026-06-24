export function SignOutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button className="text-sm text-gray-600 hover:underline">
        Log keluar
      </button>
    </form>
  )
}
