import { useState } from "react";
import { Link } from "react-router-dom";
import type { PlayerWithOverall, Team } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useActiveGame } from "@/hooks/useGameData";
import { getTierColor } from "@/lib/overall";
import { cn } from "@/lib/utils";
import { StatsGrid } from "./StatsGrid";

import bgTierS from "@/assets/player-card/bg-tier-s.png";
import bgTierA from "@/assets/player-card/bg-tier-a.png";
import bgTierB from "@/assets/player-card/bg-tier-b.png";
import bgTierC from "@/assets/player-card/bg-tier-c.png";
import bgTierD from "@/assets/player-card/bg-tier-d.png";
import bgTierE from "@/assets/player-card/bg-tier-e.png";

const bgTierImages: Record<string, string> = {
  S: bgTierS,
  A: bgTierA,
  B: bgTierB,
  C: bgTierC,
  D: bgTierD,
  E: bgTierE,
};

const frameGradients: Record<string, string> = {
  S: "linear-gradient(160deg, #999 7.69%, #000 13.94%, #000 100.01%)",
  A: "linear-gradient(160deg, #FFD900 40.39%, #D3991C 100.01%)",
  B: "linear-gradient(160deg, #9EEDA7 24.52%, #07500F 100.01%)",
  C: "linear-gradient(160deg, #98ECFF 24.52%, #03174C 100.01%)",
  D: "linear-gradient(160deg, #E0E0E0 24.52%, #242424 100.01%)",
  E: "linear-gradient(160deg, #AE814D 24.52%, #462806 100.01%)",
};

const shapeSvgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg width="350" height="578" viewBox="0 0 350 578" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M204.953 0C240.449 2.67188 273.922 12.5952 303.891 28.2949C306.121 29.4624 308.328 30.6616 310.516 31.8926C322.602 37.938 335.926 41.8813 350 43.2412V510.271C350 520.095 344.953 526.611 337.461 533.881C308.175 562.299 217.283 555.734 175 577.925C132.717 555.734 41.8255 562.299 12.5391 533.881C5.04681 526.611 0.000167208 520.095 0 510.271V43.2412C14.0742 41.8813 27.3984 37.938 39.4844 31.8926C41.6719 30.6616 43.8789 29.4624 46.1094 28.2949C76.0781 12.5952 109.551 2.67188 145.047 0C147.387 4.26318 150.906 7.3667 155.309 8.54688C162.211 10.3959 169.594 7.0693 175 0.541992C180.406 7.0693 187.789 10.3959 194.691 8.54688C199.094 7.3667 202.613 4.26318 204.953 0Z" fill="white"/></svg>`)}`;

const frameSvgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg width="350" height="578" viewBox="0 0 350 578" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M208.9 8.3623C241.597 11.4269 272.438 20.8492 300.179 35.3818L300.181 35.3828C302.338 36.512 304.474 37.6721 306.593 38.8643L306.763 38.96L306.937 39.0479C317.795 44.4792 329.587 48.3241 342 50.2832V510.271C342 516.676 339.053 521.189 331.89 528.14C326.02 533.835 316.416 538.31 303.509 541.928C290.748 545.504 275.772 547.981 259.934 550.324C244.281 552.64 227.728 554.831 212.554 557.829C198.992 560.509 185.924 563.941 175 569.009C164.076 563.941 151.008 560.509 137.446 557.829C122.272 554.831 105.719 552.64 90.0664 550.324C74.2282 547.981 59.2517 545.504 46.4912 541.928C33.5844 538.31 23.98 533.835 18.1104 528.14C10.9472 521.189 8.00015 516.676 8 510.271V50.2832C20.4127 48.3241 32.2052 44.4792 43.0635 39.0479L43.2373 38.96L43.4072 38.8643C45.5257 37.6721 47.6621 36.512 49.8193 35.3828L49.8213 35.3818C77.5621 20.8493 108.402 11.427 141.099 8.3623C144.169 12.0509 148.237 14.934 153.237 16.2744C161.199 18.4072 168.858 16.0423 175 11.498C181.142 16.0423 188.8 18.4072 196.762 16.2744C201.762 14.9341 205.83 12.0507 208.9 8.3623ZM209.735 10.4521C206.521 14.032 202.356 16.8454 197.281 18.2061H197.279C189.109 20.3948 181.327 18.2287 175 13.9482C168.673 18.2287 160.891 20.3948 152.721 18.2061C147.645 16.8454 143.478 14.0323 140.264 10.4521C108.211 13.5911 77.9758 22.8905 50.75 37.1533L50.7471 37.1543C48.6082 38.2738 46.4898 39.425 44.3887 40.6074L44.1758 40.7275L43.958 40.8359C33.4125 46.1108 22 49.9136 10 51.9795V510.271C10.0001 515.821 12.4222 519.833 19.5029 526.704C25.0097 532.048 34.2225 536.412 47.0312 540.002C59.6569 543.54 74.5202 546.003 90.3594 548.346C105.967 550.654 122.597 552.856 137.834 555.867C151.099 558.488 164.029 561.848 175 566.808C185.971 561.848 198.901 558.488 212.166 555.867C227.403 552.856 244.033 550.654 259.641 548.346C275.48 546.003 290.343 543.54 302.969 540.002C315.778 536.412 324.99 532.048 330.497 526.704C337.578 519.833 340 515.821 340 510.271V51.9795C328 49.9136 316.588 46.1108 306.042 40.8359L305.824 40.7275L305.611 40.6074C303.51 39.425 301.392 38.2738 299.253 37.1543L299.25 37.1533C272.024 22.8904 241.789 13.591 209.735 10.4521Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M204.953 0C240.449 2.67188 273.922 12.5952 303.891 28.2949C306.121 29.4624 308.328 30.6616 310.516 31.8926C322.602 37.938 335.926 41.8813 350 43.2412V510.271C350 520.095 344.953 526.611 337.461 533.881C308.175 562.299 217.283 555.734 175 577.925C132.717 555.734 41.8255 562.299 12.5391 533.881C5.04681 526.611 0.000167208 520.095 0 510.271V43.2412C14.0742 41.8813 27.3984 37.938 39.4844 31.8926C41.6719 30.6616 43.8789 29.4624 46.1094 28.2949C76.0781 12.5952 109.551 2.67188 145.047 0C147.387 4.26318 150.906 7.3667 155.309 8.54688C162.211 10.3959 169.594 7.0693 175 0.541992C180.406 7.0693 187.789 10.3959 194.691 8.54688C199.094 7.3667 202.613 4.26318 204.953 0ZM207.062 4.18262C204.326 8.11696 200.501 11.1304 195.728 12.4102C188.233 14.4179 180.768 11.6041 175 6.33203C169.232 11.6041 161.768 14.4179 154.273 12.4102C149.5 11.1304 145.673 8.11718 142.938 4.18262C108.892 7.07241 76.7831 16.7415 47.9658 31.8379L47.9639 31.8389C45.7702 32.9871 43.5991 34.1674 41.4463 35.3789L41.3613 35.4268L41.2734 35.4697C29.7967 41.2104 17.2412 45.1189 4 46.8145V510.271C4.00016 518.385 7.99618 523.9 15.3232 531.01C21.9189 537.41 32.3085 542.107 45.4121 545.779C58.4425 549.431 73.6451 551.939 89.4814 554.281C105.225 556.61 121.622 558.779 136.671 561.753C150.874 564.56 164.215 568.143 175 573.44C185.785 568.143 199.126 564.56 213.329 561.753C228.378 558.779 244.775 556.61 260.519 554.281C276.355 551.939 291.558 549.431 304.588 545.779C317.282 542.222 327.428 537.703 334.046 531.605L334.676 531.01C342.003 523.899 346 518.386 346 510.271V46.8145C332.759 45.1189 320.203 41.2104 308.727 35.4697L308.639 35.4268L308.554 35.3789C306.401 34.1674 304.23 32.9871 302.036 31.8389L302.034 31.8379C273.217 16.7413 241.108 7.07231 207.062 4.18262Z" fill="white"/></svg>`)}`;

interface PlayerCardProps {
  player: PlayerWithOverall;
  team?: Team;
  showTeam?: boolean;
  className?: string;
}

function getRoleColor(role: string): string {
  const map: Record<string, string> = {
    duelist: "#ef4444",
    initiator: "#8b5cf6",
    controller: "#3b82f6",
    sentinel: "#10b981",
    flex: "#ec4899",
  };
  return map[role] ?? "#9191ab";
}

function getRoleLabel(
  role: string,
  game: { roles: { id: string; label: string }[] },
): string {
  return game.roles.find((r) => r.id === role)?.label ?? role;
}

export function PlayerCard({
  player,
  team,
  showTeam = true,
  className,
}: PlayerCardProps) {
  const [photoError, setPhotoError] = useState(false);
  const [teamLogoError, setTeamLogoError] = useState(false);
  const [roleIconError, setRoleIconError] = useState(false);
  const [flagError, setFlagError] = useState(false);

  const game = useActiveGame();
  const tierColor = getTierColor(player.tier, true);
  const normalizedTeamName =
    team?.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? "";
  const roleColor = getRoleColor(player.role);
  const roleLabel = getRoleLabel(player.role, game);


  // FUT Style Card
  return (
    <Link
      to={`/teams/${player.teamId}/${player.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2",
        "@container w-[350px] max-w-full aspect-350/578",
        className,
      )}
      style={{
        backgroundImage: `url(${bgTierImages[player.tier] || bgTierS})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        maskImage: `url("${shapeSvgDataUri}")`,
        maskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskImage: `url("${shapeSvgDataUri}")`,
        WebkitMaskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      {/* Top Left: Overall & Tier */}
      <div className="absolute top-0 py-[16cqw] px-[2cqw] left-[10cqw] flex flex-col items-center z-20 bg-linear-to-b from-white/80 to-transparent gap-[2.68cqw]">
        <span className="text-[12cqw] font-bold text-black leading-none">
          {player.overall.toFixed(0)}
        </span>
        {/* Adjustment indicator */}
        {player.overallAdjustment !== 0 && (
          <div className="bottom-0 flex items-center">
            <Badge
              className={cn(
                "h-auto text-[2.86cqw] font-bold px-[2.28cqw] py-[0.57cqw] rounded-full",
                player.overallAdjustment > 0
                  ? "bg-emerald-700 text-white"
                  : "bg-red-700 text-white",
              )}
            >
              {player.overallAdjustment > 0 ? "+" : ""}
              {player.overallAdjustment}
            </Badge>
          </div>
        )}

        <Badge
          className="h-auto text-[5.14cqw] font-bold text-white px-[4cqw] py-0"
          style={{ backgroundColor: tierColor }}
        >
          {player.tier}
        </Badge>

        {/* Role Icon/Label */}
        <div
          className=" text-[3cqw] font-bold text-black uppercase tracking-wider flex items-center gap-[1cqw]"
          style={{ borderColor: `${roleColor}80` }}
        >
          {!roleIconError && (
            <img
              src={`/assets/roles/${player.role.toLowerCase()}.png`}
              alt=""
              className="w-[7cqw] h-[7cqw] object-contain brightness-0"
              onError={() => setRoleIconError(true)}
            />
          )}
          {roleIconError && <span>{roleLabel}</span>}
        </div>
      </div>

      {/* Top Right: Team & Country */}
      <div className="absolute top-0 py-[16cqw] px-[2cqw] right-[10cqw] flex flex-col items-center z-20 bg-linear-to-b from-white/50 to-transparent gap-[2.68cqw]">
        {team && showTeam && (
          <div>
            {!teamLogoError ? (
              <img
                src={`/assets/teams/${normalizedTeamName}.svg`}
                alt={team.shortName}
                className="w-[12cqw] h-[12cqw] object-contain"
                onError={() => setTeamLogoError(true)}
              />
            ) : (
              <span className="text-[12cqw]">{team.logo}</span>
            )}
          </div>
        )}
        <div className="text-[4.57cqw]">
          {!flagError ? (
            <img
              src={`/assets/flags/flag-for-flag-${player.country.toLowerCase()}-svgrepo-com.svg`}
              alt={player.country}
              className="w-[12cqw] h-auto object-contain"
              onError={() => setFlagError(true)}
            />
          ) : (
            player.countryFlag
          )}
        </div>
      </div>

      {/* Player Photo */}
      <div className="absolute top-[8%] inset-x-0 flex justify-center items-end z-10 pointer-events-none">
        {!photoError ? (
          <img
            src={`/assets/players/${player.nickname.toLowerCase()}.png`}
            alt={player.nickname}
            className="w-[120%] h-[120%] object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
            onError={() => setPhotoError(true)}
          />
        ) : player.photo && player.photo.startsWith("http") ? (
          <img
            src={player.photo}
            alt={player.nickname}
            className="w-[120%] h-[120%] object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-[36.57cqw] h-[36.57cqw] rounded-full mb-[4.57cqw] flex items-center justify-center text-[17.14cqw] font-black bg-black/20 border-2 border-white/20 text-white">
            {player.photo ? player.photo : player.nickname[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Bottom Gradient overlay */}
      <div className="absolute bottom-0 inset-x-0 h-[55%] bg-linear-to-t from-[#000000] to-transparent z-10 pointer-events-none" />

      {/* Bottom Content */}
      <div className="absolute bottom-0 inset-x-0 p-[4.57cqw] pb-[14cqw] flex flex-col items-center z-20">
        {/* Name */}
        <div className="flex items-center justify-center gap-[2cqw] w-full px-[2.28cqw] mb-[1.14cqw]">
          {player.isIgl && (
            <img
              src="/assets/roles/igl.svg"
              alt="IGL"
              className="w-[6cqw] h-[6cqw] object-contain brightness-0 invert"
            />
          )}
          <h3 className="text-[12cqw] font-semibold text-white tracking-wide leading-none uppercase truncate">
            {player.nickname}
          </h3>
        </div>

        {/* Divider */}
        <div className="w-[85%] h-px bg-white/20 my-[2.28cqw]" />

        {/* Stats Grid */}
        <StatsGrid
          stats={player.stats}
          statDefs={game.statDefinitions}
          variant="fut"
        />
      </div>

      {/* Frame Overlay */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: frameGradients[player.tier] || frameGradients.S,
          maskImage: `url("${frameSvgDataUri}")`,
          maskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskImage: `url("${frameSvgDataUri}")`,
          WebkitMaskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </Link>
  );
}
