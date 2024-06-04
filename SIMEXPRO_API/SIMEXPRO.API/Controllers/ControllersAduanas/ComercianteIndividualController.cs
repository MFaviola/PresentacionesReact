using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIMEXPRO.API.Models.ModelsAduana;
using SIMEXPRO.BussinessLogic.Services.EventoServices;
using SIMEXPRO.Entities.Entities;
using SIMEXPRO.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMEXPRO.API.Controllers.ControllersAduanas
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComercianteIndividualController : Controller
    {
        private readonly AduanaServices _aduanaServices;
        private readonly IMapper _mapper;
        private readonly IMailService _mailService;

        public ComercianteIndividualController(AduanaServices AduanaServices, IMapper mapper, IMailService mailService)
        {
            _aduanaServices = AduanaServices;
            _mapper = mapper;
            _mailService = mailService;

        }


        [HttpGet("Listar")]
        public IActionResult Index()
        {
            var listado = _aduanaServices.ListarComercianteIndividual();
            listado.Data = _mapper.Map<IEnumerable<ComercianteIndividual>>(listado.Data);
            return Ok(listado);
        }

        [HttpPost("Insertar")]
        public IActionResult Insertar(ComercianteIndividual comercianteIndividual)
        {
            var mapped = _mapper.Map<tbComercianteIndividual>(comercianteIndividual);
            var datos = _aduanaServices.InsertarComercianteIndividual(mapped);
            return Ok(datos);
        }

        [HttpPost("InsertarTap2")]
        public IActionResult InsertarTap2(ComercianteIndividual comercianteIndividual)
        {
            var mapped = _mapper.Map<tbComercianteIndividual>(comercianteIndividual);
            var datos = _aduanaServices.InsertarComercianteIndividualTap2(mapped);
            return Ok(datos);
        }

        [HttpPost("InsertarTap3")]
        public IActionResult InsertarTap3(ComercianteIndividual comercianteIndividual)
        {
            var mapped = _mapper.Map<tbComercianteIndividual>(comercianteIndividual);
            var datos = _aduanaServices.InsertarComercianteIndividualTap3(mapped);
            return Ok(datos);
        }

        [HttpPost("InsertarTap4")]
        public IActionResult InsertarTap4(ComercianteIndividual comercianteIndividual)
        {
            var mapped = _mapper.Map<tbComercianteIndividual>(comercianteIndividual);
            var datos = _aduanaServices.InsertarComercianteIndividualTap4(mapped);
            return Ok(datos);
        }


        [HttpPost("Editar")]
        public IActionResult Editar(ComercianteIndividual comercianteIndividual)
        {
            var mapped = _mapper.Map<tbComercianteIndividual>(comercianteIndividual);
            var datos = _aduanaServices.ActualizarComercianteIndividual(mapped);
            return Ok(datos);
        }



        [HttpPost("Eliminar")]
        public IActionResult Eliminar(int coin_Id, int pers_Id)
        {
            var respuesta = _aduanaServices.EliminarComerciante(coin_Id, pers_Id);
            return Ok(respuesta);
        }


        [HttpPost("FinalizarContrato")]
        public IActionResult FinalizarContratoComerciante(int coin_Id)
        {
            var datos = _aduanaServices.FinalizarContratoComerciante(coin_Id);
            return Ok(datos);
        }

        [HttpGet("EnviarCodigo")]
        public IActionResult CodigoCorreo(string correo)
        {
            Random random = new Random();
            string codigo = random.Next(10000, 100000).ToString();

            if (!string.IsNullOrEmpty(correo))
            {
                _aduanaServices.InsertarCodigo(correo, codigo);
                MailData mailData = new MailData
                {
                    EmailToId = correo,
                    EmailToName = "Confirmación de Correo Electrónico",
                    EmailSubject = "Código para confirmar correo electrónico",
                    EmailBody = "Código " + codigo
                };
                _mailService.SendMail(mailData);
                return Ok(new { message = "Código enviado con éxito" });
            }

            return BadRequest(new { message = "Correo inválido" });
        }


        [HttpPost("ConfirmarCodigo")]
        public IActionResult ConfirmarCodigo(string codigo)
        {
            var result = _aduanaServices.ConfirmarCodigo(codigo);

            if (result.Success)
            {
                return Ok(new { message = "Exito" });
            }
            else
            {
                return BadRequest(new { message = "Código incorrecto" });
            }
        }
        [HttpGet("EnviarCodigo2")]
        public IActionResult CodigoCorreo2(string correo)
        {
            Random random = new Random();
            string codigo = random.Next(10000, 100000).ToString();

            if (!string.IsNullOrEmpty(correo))
            {
                _aduanaServices.InsertarCodigo2(correo, codigo);
                MailData mailData = new MailData
                {
                    EmailToId = correo,
                    EmailToName = "Confirmación de Correo Electrónico",
                    EmailSubject = "Código para confirmar correo electrónico",
                    EmailBody = "Código " + codigo
                };
                _mailService.SendMail(mailData);
                return Ok(new { message = "Código enviado con éxito" });
            }

            return BadRequest(new { message = "Correo inválido" });
        }


        [HttpPost("ConfirmarCodigo2")]
        public IActionResult ConfirmarCodigo2(string codigo)
        {
            var result = _aduanaServices.ConfirmarCodigo2(codigo);

            if (result.Success)
            {
                return Ok(new { message = "Exito" });
            }
            else
            {
                return BadRequest(new { message = "Código incorrecto" });
            }
        }

    }
}
