"use client"

export default function RecommendedGames({ games }) {

  return (
    <div className="mt-10">

      <h2 className="text-purple-400 text-xl mb-4">
        Recommended Games
      </h2>

      <div className="grid grid-cols-3 gap-6">

        {games.map(game => (

          <div
            key={game.name}
            className="bg-[#111] p-4 rounded-xl border border-purple-500/20"
          >

            <p>{game.name}</p>

          </div>

        ))}

      </div>

    </div>
  )
}